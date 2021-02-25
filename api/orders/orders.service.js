const fs = require("fs");
const path = require("path");
require('dotenv').config();
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const constants = require("../config/constants");

const dev = process.env.dev === '1';
const invoicesPath = dev ? "public/invoices" : constants.INVOICES_PATH;

const browserParams = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,    
}
if (dev) {
    browserParams.executablePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
}

async function generatePdf(html, pdfPath) {
    const pdfOptions = Object.assign({}, PDF_OPTIONS, {path: pdfPath});
    const browser = await puppeteer.launch(browserParams);
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});
	await page.pdf(pdfOptions);
    await browser.close();
}

const headerTemplate = "<p></p>";
const footerTemplate = "<div style=\" background: #999; width: 100%; font-size: 8px; line-height: 1px; color: #999; text-align: center;\">" +
"<p>Tél: +216 22 55 93 06 - E-mail: contact@meduse.tn | Site web: http://www.meduse.tn </p>" + 
"<p>Résidence Narjess, Les jardins d'El Aouina, 2036 Tunis | MF:1674042 / N / B / M / 000 | RIB BH : 14093093101700105713 </p>" + 
"</div>";

const PDF_OPTIONS = {
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    displayHeaderFooter: true,
    printBackground: true,
    format: 'A4',
    margin: { 
        top: "30px", 
        bottom: "60px",
        right: "12px",
        left: "12px"
    }
};

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('ifNotZero', function(arg1, options) {
    return (arg1 && arg1 > 0) ? options.fn(this) : options.inverse(this);
});

const orders = require('./orders.model');
const orderRowsService = require('./../orderRows/orderRows.service');
const usersService = require('./../users/user.service');
const productsService = require('./../products/products.service');
const productVariantsService = require("./../products/productVariants.service");
const couponsService = require('./../coupons/coupons.service');
const settingsService = require("../settings/settings.service");

const utils = require('../utils');
const mailService = require('../mailing/mail.service');
const { padNumber } = require("../utils");

module.exports = {
    getAll,
    getById,
    findMyOrderById,
    findByClientId,
    findByRef,
    findByState,
    findByStatus,
    findByCreator,
    findCreatedBetween,
    getMyOrders,
    search,
    updateOrderStatus,
    submitOrder,
    createOrder,
    remove,
    updateById,
    generateInvoice,
    generateDeliveryInvoice,
    generateCreditInvoice,
    getOrderTotal,
    applyReduction,
    cancelReduction
};

function getAll() {
    return new Promise((resolve, reject) => {
        orders
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        orders.getById(id)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

async function findMyOrderById(userId, orderId) {
    if (userId === undefined || orderId === undefined) {
        throw new Error('no user id || orderId');
    }
    const order = await getById(orderId);
    if (('' + order.client_id) !== '' + userId) {
        throw new Error('unauthorized');
    }

    const deliveryAddress = {
        address: order.delivery_address,
        zipcode: order.delivery_zipcode,
        city: order.delivery_city,
        state: order.delivery_state,
        phone: order.delivery_phone
    };
    const billingAddress = {
        address: order.billing_address,
        zipcode: order.billing_zipcode,
        city: order.billing_city,
        state: order.billing_state,
        phone: order.billing_phone
    };

    const rowsDetails = [];
    let rows = await orderRowsService.getByOrderId(orderId);
    rows = rows && rows.length ? rows : [];
    for(const row of rows) {
        const productAndVariants = await productsService.getByIdWithVariants(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        rowsDetails.push({
            product,
            variant,
            quantity: row.quantity
        });
    }

    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const totalInfos = await getOrderTotal(order.id);
    
        return {
            order,
            billingAddress,
            deliveryAddress,
            totalInfos,
            rowsDetails
        }
}

function getMyOrders(headerUserId, paramsUserId) {
    return new Promise((resolve, reject) => {
        if (headerUserId === paramsUserId) {
            return findByClientId(headerUserId);
        } else {
            reject();
        }
    });
}

function findByClientId(id) {
    return new Promise((resolve, reject) => {
        orders.findByClientId(id)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function findByRef(ref) {
    return new Promise((resolve, reject) => {
        orders.findByRef(ref)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function findByStatus(status) {
    return new Promise((resolve, reject) => {
        orders.findByState(status)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function findByState(state) {
    return new Promise((resolve, reject) => {
        orders.findByState(state)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function findByCreator(id) {
    return new Promise((resolve, reject) => {
        orders.findByCreator(id)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function findCreatedBetween(date1, date2) {
    return new Promise((resolve, reject) => {
        orders.findCreatedBetween(date1, date2)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

async function search(status, payment, ptype) {
    const found = await orders.search(status, payment, ptype);
    const result = [];
    for (const order of found) {
        const totalInfos = await getOrderTotal(order.id);
        order.total = totalInfos.total;
        result.push(order);
    }
    return result;
}

function remove(id) {
    return new Promise((resolve, reject) => {
        orders.remove(id)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function updateOrderStatus(id, status) {
    const newStatusData = {
        status
    };
    if (status === 'shipping') {
        newStatusData.shipping_date = new Date();
    } else if (newState === 'canceled') {
        newStatusData.canceled_date = new Date();
    }
    return new Promise((resolve, reject) => {
        orders.updateOrderStatus(id, newStatusData)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

async function updateById(id, newOrder) {
    const order = await getById(id);
    const oldPaymentStatus = order.payment_status;
    const oldStatus = order.order_status;

    if(newOrder.order_status === 'shipped') {
        newOrder.shipped_date = new Date();
    } else if (newOrder.order_status === 'canceled') {
        newOrder.canceled_date = new Date(); 
    }
    
    return new Promise((resolve, reject) => {
        orders.updateById(id, newOrder)
            .then(async (result) => {
                if(newOrder.payment_status !== oldPaymentStatus) {
                    if (newOrder.payment_status === '1') {
                        await grantPoints(order);
                    } else {
                        await retrievePoints(order);
                    }
                }
                if (newOrder.order_status !== oldStatus) {
                    if (newOrder.order_status === 'confirmed') {
                        await processOrder(order);
                    } else {
                        if (newOrder.order_status === 'canceled') {
                            await processOrder(order, true);
                        }
                    }
                }

                resolve(result);
            },
            (err) => reject(err));
    });
}

async function submitOrder(userId, orderDetails) {
    const order = {
        client_Id: userId,
        order_date: new Date(),
        client_message: orderDetails.message,
        coupon_id : orderDetails.coupon_id,
        delivery_address: orderDetails.delivery_address,
        delivery_zipcode: orderDetails.delivery_zipcode,
        delivery_city: orderDetails.delivery_city,
        delivery_state: orderDetails.delivery_state,
        delivery_phone: orderDetails.delivery_phone,
        billing_address: orderDetails.billing_address,
        billing_zipcode: orderDetails.billing_zipcode,
        billing_city: orderDetails.billing_city,
        billing_state: orderDetails.billing_state,
        billing_phone: orderDetails.billing_phone,
        ptype: orderDetails.ptype,
        creator_id: userId
    };
    //check coupon
    if (order.coupon_id !== undefined && order.coupon_id !== null) {
        const coupon = await couponsService.getById(order.coupon_id);
        if (coupon) {
            await couponsService.updateCouponStatus(order.coupon_id, 1);
        } else {
            order.coupon_id = null;
        }
    }
    mailService.sendNewOrderNotification();
    return doCreateOrder(order, orderDetails.orderRows, true);  
}

function createOrder(userId, orderDetails) {
    const order = {
        client_Id: orderDetails.client_id,
        order_status: 'new',
        order_date: new Date(),
        client_message: orderDetails.client_message,
        delivery_address: orderDetails.delivery_address,
        delivery_zipcode: orderDetails.delivery_zipcode,
        delivery_city: orderDetails.delivery_city,
        delivery_state: orderDetails.delivery_state,
        delivery_phone: orderDetails.delivery_phone,
        billing_address: orderDetails.billing_address,
        billing_zipcode: orderDetails.billing_zipcode,
        billing_city: orderDetails.billing_city,
        billing_state: orderDetails.billing_state,
        billing_phone: orderDetails.billing_phone,
        ptype: orderDetails.ptype,
        creator_id: userId
    };

    return doCreateOrder(order, orderDetails.orderRows);
}

async function doCreateOrder(order, orderRows, notifyAdmins) {
    let rowsData = orderRows.split(';').map((row) => JSON.parse(row));
    let rows = [];
    const addedOrder = await orders.add(order);

    if (addedOrder) {
        for (const each of rowsData) {
            const product = await productsService.getById(each.productId);
            const originalPrice = product.price;
            const price = product.promo_price ? product.promo_price : product.price;
            rows.push ({
                order_id: addedOrder.id,
                product_id: each.productId,
                variant_id: each.variantId,
                quantity: each.quantity,
                price,
                original_price: originalPrice,
                reduction: each.reduction || 0
            });
        }
        const addedRows = await orderRowsService.addAll(rows);

        if (addedRows.affectedRows) {
            await sendOrderReceivedMail(addedOrder);
            if (notifyAdmins) {
                await mailService.sendNewOrderNotification(addedOrder);
            }
            return {addedOrder, lines: addedRows};
        } else {
            console.error('error while adding order lines');
            await remove(addedOrder.id);
            console.log('removed order after failing adding its lines');
        }
    }
}

async function sendOrderReceivedMail(orderData) {
    const order = await getById(orderData.id);
    const user = await usersService.getById(order.client_id);
    mailService.sendOrderReceivedMail(user.name, user.email, order.order_ref);
}

async function getDataForInvoice(orderId, date, mf, invoiceType) {
    const rowsDetails = [];
    const order = await getById(orderId);
    const deliveryAddress = {
        address: order.delivery_address,
        zipcode: order.delivery_zipcode,
        city: order.delivery_city,
        state: order.delivery_state,
        phone: order.delivery_phone
    };
    const billingAddress = {
        address: order.billing_address,
        zipcode: order.billing_zipcode,
        city: order.billing_city,
        state: order.billing_state,
        phone: order.billing_phone
    };

    const client = await usersService.getById(order.client_id);
    const rows = await orderRowsService.getByOrderId(orderId);
    for(const row of rows) {
        const productAndVariants = await productsService.getByIdWithVariants(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        let price;
        if (row.price) {
            price = row.price;
        } else {
            price = product.promo_price ? product.promo_price : product.price;
        }
        rowsDetails.push({
            product,
            variant,
            quantity: row.quantity,
            price
        });
    }

    const lines = rowsDetails.map((item) => ({
        name: item.variant ? (`${item.product.label}${item.variant.color ? ' - ' + item.variant.color: ''}${item.variant.size ? ' - ' + item.variant.size: ''}`)
            : item.product.label,
        quantity: item.quantity,
        price: `${item.price} D.T`
    }));

    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const totalInfos = await getOrderTotal(orderId);
    
    let num;
    switch(invoiceType) {
        case 'delivery':
            num = await getDeliveryInvoiceNumber();
            break;
        case 'credit':
            num = await getCreditInvoiceNumber();
            break;
        default:
            num = await getInvoiceNumber();
            break; 
    }

    const year = new Date().getUTCFullYear();
    const data = {
        invoiceNumber: `${year}-${num}`,
        creationDate: date,
        order,
        lines,
        deliveryAddress,
        billingAddress,
        client,
        totalInfos,
        totalText: utils.NumberToLetter(totalInfos.total, 'dinars', 'millimes'),
        points: Math.floor(totalInfos.totalTTC),
        mf
    };

    return data;
}

async function generateInvoice(orderId, date, mf) {

    const data = await getDataForInvoice(orderId, date, mf);
    const templateHtml = fs.readFileSync(path.join(process.cwd(), '/orders/invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const year = new Date().getUTCFullYear();
    const filename = `Facture-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

async function generateDeliveryInvoice(orderId, date, mf) {
    
    const data = await getDataForInvoice(orderId, date, mf, 'delivery');
    const templateHtml = fs.readFileSync(path.join(process.cwd(), '/orders/delivery-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const year = new Date().getUTCFullYear();
    const filename = `BonDeCommande-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

async function generateCreditInvoice(orderId, date, mf) {
    
    const data = await getDataForInvoice(orderId, date, mf, 'credit');
    const templateHtml = fs.readFileSync(path.join(process.cwd(), '/orders/credit-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);
    
    const year = new Date().getUTCFullYear();
    const filename = `FactureAvoir-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

//orderDetails = [{product, variant, quantity}]
function getOrderTotalInfos(orderRowsDetails, premium = 0, shippingSettings) {
    const totalTTC = orderRowsDetails.reduce((acc, cur) => {
        const subTotal = cur.price * cur.quantity;
        return acc + subTotal;
    }, 0);

    const totalTVA = orderRowsDetails.reduce((acc, cur) => {
        const price = cur.price;
        const tva = (price / (+100 + cur.tva)) * cur.tva;
        return acc + tva * cur.quantity;
    }, 0);

    const totalHT = orderRowsDetails.reduce((acc, cur) => {
        const price = cur.price;
        const tva = (price / (+100 + cur.tva)) * cur.tva;
        return acc + (price - tva) * cur.quantity;
    }, 0);

    const shipping = premium === 1 || shippingSettings.free === '1' || totalTTC >= parseFloat(shippingSettings.freeFrom) ? 0 : parseFloat(shippingSettings.shippingFee);
    const timbreFiscale = 0.6;
    const total = totalTTC + shipping + timbreFiscale;
    return {
        totalHT: totalHT.toFixed(3),
        totalTVA: totalTVA.toFixed(3),
        totalTTC: totalTTC.toFixed(3),
        shipping,
        shippingText: shipping === 0 ? 'Livraison gratuite': `${shipping} D.T`,
        timbreFiscale : timbreFiscale.toFixed(3),
        total: total.toFixed(3)
    }
}

function getOrderTotalInfosAfterReduction(orderRowsDetails, premium, shippingSettings, reductionValue) {
    const orderTotalInfos = getOrderTotalInfos(orderRowsDetails, premium, shippingSettings);
    orderTotalInfos.couponReduction = reductionValue;
    const newTotal = ((100 - parseInt(reductionValue))/100) * orderTotalInfos.totalTTC;
    orderTotalInfos.totalTTC = newTotal;
    orderTotalInfos.total = orderTotalInfos.totalTTC + orderTotalInfos.shipping;
    
    orderTotalInfos.totalTTC = orderTotalInfos.totalTTC.toFixed(3);
    orderTotalInfos.total = orderTotalInfos.total.toFixed(3);
    return orderTotalInfos;
}

async function getInvoiceNumber() {
    const num = await settingsService.getAndIncrementInvoiceNumber();
    return padNumber(num, 6);
}

async function getDeliveryInvoiceNumber() {
    const num = await settingsService.getAndIncrementDeliveryInvoiceNumber();
    return padNumber(num, 6);
}

async function getCreditInvoiceNumber() {
    const num = await settingsService.getAndIncrementCreditInvoiceNumber();
    return padNumber(num, 6);
}

async function getOrderTotal(orderId) {
    const order = await getById(orderId);
    const clientId = order.client_id;
    const client = await usersService.getById(clientId);

    const rowsDetails = [];
    const rows = await orderRowsService.getByOrderId(orderId);
    if (rows && rows.length) {
        for(const row of rows) {
            const product = await productsService.getById(row.product_id);
            let price;
            if (row.price !== null) {
                price = row.price;
            } else {
                price = product.promo_price !== null ? product.promo_price : product.price;
            }
            rowsDetails.push({
                price,
                quantity: row.quantity,
                tva: product.tva
            });
        }
        let totalInfo = null;
        const shippingSettings = await settingsService.getByType('shipping');
        const shippingData = {};
        shippingSettings.forEach((i) => shippingData[i.label] = i.value);
    
        if (order.coupon_id !== null && order.coupon_id !== undefined) {
            const coupon = await couponsService.getById(order.coupon_id);
            totalInfo = getOrderTotalInfosAfterReduction(rowsDetails, client.premium, shippingData, coupon.value);
        } else {
            totalInfo = getOrderTotalInfos(rowsDetails, client.premium, shippingData);
        }
        if (order.reduction && order.reduction > 0) {
            totalInfo.reduction = order.reduction;
            totalInfo.totalTTCAfterReduction = totalInfo.totalTTC - order.reduction;
            totalInfo.total = totalInfo.total - order.reduction;
        }
        return totalInfo;
    } else {
        return {};
    }
    
}

async function grantPoints(order) {
    const totalInfo = await getOrderTotal(order.id);
    const client = order ? await usersService.getById(order.client_id) : null;
    if (client) {
        const newPoints = +client.points + +Math.floor(totalInfo.totalTTC);
        usersService.updateClientPoints(client.id, newPoints);
    } else {
        console.error('[orders.service]: failed to grant points to client');
    }
    
}

async function retrievePoints(order) {
    const totalInfo = await getOrderTotal(order.id);
    const client = order ? await usersService.getById(order.client_id) : null;
    if (client) {
        const newPoints = +client.points - +Math.floor(totalInfo.totalTTC);
        usersService.updateClientPoints(client.id, newPoints);
    } else {
        console.error('[orders.service]: failed to grant points to client');
    }
}

async function processOrder(order, isCanceled) {
    const orderRows = await orderRowsService.getByOrderId(order.id);
    orderRows.forEach(async (row) => {
        if (row.variant_id) {
            if (isCanceled) {
                await productVariantsService.addQuantity(row.variant_id, row.quantity);
            } else {
                await productVariantsService.subQuantity(row.variant_id, row.quantity);
            }
        } else {
            if (isCanceled) {
                await productsService.addQuantity(row.product_id, row.quantity);
            } else {
                await productsService.subQuantity(row.product_id, row.quantity);
            }
        }
    });
    const productsWithVariants = orderRows
        .filter((each) => each.variant_id !== null)
        .map((each) => each.product_id)
        .filter((v, i, a) => a.indexOf(v) === i);
    if (productsWithVariants.length) {
        productsService.updateProductQuantityFromVariants(productsWithVariants);
    }
}

function applyReduction(id, reduction) {
    return new Promise((resolve, reject) => {
        orders.setReduction(id, reduction)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function cancelReduction(id) {
    return new Promise((resolve, reject) => {
        orders.setReduction(id, 0)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}
