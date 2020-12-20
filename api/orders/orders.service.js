const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const headerTemplate = "<p></p>";
const footerTemplate = "<div style=\" background: #999; width: 100%; font-size: 8px; line-height: 1px; color: #999; text-align: center;\">" +
"<p>Tél: +216 22 55 93 06 - E-mail: contact@meduse.tn | Site web: http://www.meduse.tn </p>" + 
"<p>Résidence Narjess, Les jardins d'El Aouina, 2036 Tunis | MF:1674042 / N / B / M / 000 | RIB BH : 14093093101700105713 </p>" + 
"</div>";

const orders = require('./orders.model');
const orderRowsService = require('./../orderRows/orderRows.service');
const usersService = require('./../users/user.service');
const productsService = require('./../products/products.service');
const productVariantsService = require("./../products/productVariants.service");
const couponsService = require('./../coupons/coupons.service');
const settingsService = require("../settings/settings.service");

const utils = require('../utils');
const mailService = require('../mailing/mail.service');

module.exports = {
    getAll,
    getById,
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
    getOrderTotal
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

function search(status, payment, ptype) {
    return new Promise((resolve, reject) => {
        orders.search(status, payment, ptype)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
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

function updateById(id, newOrder) {
    if(newOrder.order_status === 'shipped') {
        newOrder.shipped_date = new Date();
    } else if (newOrder.order_status === 'canceled') {
        newOrder.canceled_date = new Date(); 
    }
    
    return new Promise((resolve, reject) => {
        orders.updateById(id, newOrder)
            .then(async (result) => {
                if(newOrder.payment_status === '1') {
                    await grantPoints(id);
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
    return doCreateOrder(order, orderDetails.orderRows);  
}

function createOrder(orderDetails) {
    const order = {
        client_Id: orderDetails.client_id,
        order_status: 'new',
        order_date: new Date(),
        client_message: orderDetails.client_message,
        delivery_address: orderDetails.deliveryAddress,
        delivery_zipcode: orderDetails.deliveryZipCode,
        delivery_city: orderDetails.deliveryCity,
        delivery_state: orderDetails.deliveryState,
        delivery_phone: orderDetails.deliveryPhone,
        billing_address: orderDetails.billingAddress,
        billing_zipcode: orderDetails.billingZipCode,
        billing_city: orderDetails.billingCity,
        billing_state: orderDetails.billingState,
        billing_phone: orderDetails.billingPhone,
        ptype: orderDetails.ptype,
        creator_id: orderDetails.client_id
    };

    return doCreateOrder(order, orderDetails.orderRows);
}

function doCreateOrder(order, orderRows) {
    let rows = orderRows.split(';').map((row) => JSON.parse(row));

    return new Promise((resolve, reject) => {
        orders.add(order)
            .then((addedOrder) => {

                rows = rows.map((item) => ({ order_id: addedOrder.id, ...item }));
                orderRowsService.addAll(rows)
                    .then((addedRows) => {
                        sendOrderReceivedMail(addedOrder);
                        resolve({addedOrder, lines: addedRows});
                    }, (error) => {
                        remove(addedOrder.id)
                            .then(() => {
                                console.error('error while adding order lines');
                                console.log('removed order after failing adding its lines');
                                reject(error);
                            }, (error) => {
                                console.error('error while adding order lines');
                                console.error('error while trying to remove order after failing adding its lines');
                                reject(error);
                            });
                    })
            },
            (err) => reject(err));
    });
}

async function sendOrderReceivedMail(orderData) {
    const order = await getById(orderData.id);
    const user = await usersService.getById(order.client_id);
    mailService.sendOrderReceivedMail(user.name, user.email, order.order_ref);
}

async function generateInvoice(orderId, date, mf) {

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
        const productAndVariants = await productsService.getById(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        rowsDetails.push({
            product,
            variant,
            quantity: row.quantity
        });
    }

    const reductionValue = (order.coupon_id !== null && order.coupon_id !== undefined) ? await couponsService.getById(order.coupon_id).value : null;

    const lines = rowsDetails.map((item) => ({
        name: item.variant ? (`${item.product.label}${item.variant.color ? ' - ' + item.variant.color: ''}${item.variant.size ? ' - ' + item.variant.size: ''}`)
            : item.product.label,
        quantity: item.quantity,
        price: item.product.promo_price ? `${item.product.promo_price} D.T` : `${item.product.price} D.T`
    }));

    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const totalInfos = reductionValue ? getOrderTotalInfosAfterReduction(rowsDetails, client.premium, shippingData, reductionValue)
        : getOrderTotalInfos(rowsDetails, client.premium, shippingData);
    const data = {
        invoiceNumber: getInvoiceNumber(),
        creationDate: date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString(),
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

    const templateHtml = fs.readFileSync(path.join(process.cwd(), '/orders/invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);
    
    var milis = new Date();
    milis = milis.getTime();

    var filename = `Facture-${order.order_ref}-${milis}.pdf`;
    var pdfPath = path.join('public/invoices', filename);
    // header template = <div style=\"font-size: 8px\"><div class='pageNumber'></div> <div>/</div><div class='totalPages'></div></div>
    var options = {
        headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        displayHeaderFooter: true,
        printBackground: true,
        path: pdfPath,
        format: 'A4',
        margin: { 
            top: "30px", 
            bottom: "60px",
            right: "12px",
            left: "12px"
        }
    };

    const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
        });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
    await browser.close();
    
    return filename;
}

async function generateDeliveryInvoice(orderId, date, mf) {
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
        const productAndVariants = await productsService.getById(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        rowsDetails.push({
            product,
            variant,
            quantity: row.quantity
        });
    }

    const reductionValue = (order.coupon_id !== null && order.coupon_id !== undefined) ? await couponsService.getById(order.coupon_id).value : null;

    const lines = rowsDetails.map((item) => ({
        name: item.variant ? (`${item.product.label}${item.variant.color ? ' - ' + item.variant.color: ''}${item.variant.size ? ' - ' + item.variant.size: ''}`)
            : item.product.label,
        quantity: item.quantity,
        price: item.product.promo_price ? `${item.product.promo_price} D.T` : `${item.product.price} D.T`
    }));

    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const totalInfos = reductionValue ? getOrderTotalInfosAfterReduction(rowsDetails, client.premium, shippingData, reductionValue)
        : getOrderTotalInfos(rowsDetails, client.premium, shippingData);
    const data = {
        invoiceNumber: getInvoiceNumber(),
        creationDate: date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString(),
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

    const templateHtml = fs.readFileSync(path.join(process.cwd(), '/orders/delivery-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);
    
    var milis = new Date();
    milis = milis.getTime();

    var filename = `BonDeCommande-${order.order_ref}-${milis}.pdf`;
    var pdfPath = path.join('public/invoices', filename);

    var options = {
        width: '1230px',
        headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        displayHeaderFooter: true,
        printBackground: true,
        path: pdfPath,
        format: 'A4',
        margin: { 
            top: "30px", 
            bottom: "60px",
            right: "12px",
            left: "12px"
        }
    };

    const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
        });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
    await browser.close();
    
    return filename;
}

//orderDetails = [{product, variant, quantity}]
function getOrderTotalInfos(orderRowsDetails, premium = 0, shippingSettings) {
    const totalTTC = orderRowsDetails.reduce((acc, cur) => {
        const price = cur.product.promo_price ? cur.product.promo_price : cur.product.price;
        const subTotal = price * cur.quantity;
        return acc + subTotal;
    }, 0);

    const totalTVA = orderRowsDetails.reduce((acc, cur) => {
        const price = cur.product.promo_price ? cur.product.promo_price : cur.product.price;
        const tva = (price / (+100 + cur.product.tva)) * cur.product.tva;
        return acc + tva * cur.quantity;
    }, 0);

    const totalHT = orderRowsDetails.reduce((acc, cur) => {
        const price = cur.product.promo_price ? cur.product.promo_price : cur.product.price;
        const tva = (price / (+100 + cur.product.tva)) * cur.product.tva;
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
    orderTotalInfos.reduction = reductionValue;
    const newTotal = ((100 - parseInt(reductionValue))/100) * orderTotalInfos.totalTTC;
    orderTotalInfos.totalTTC = newTotal;
    orderTotalInfos.total = orderTotalInfos.totalTTC + orderTotalInfos.shipping;
    
    orderTotalInfos.totalTTC = orderTotalInfos.totalTTC.toFixed(3);
    orderTotalInfos.total = orderTotalInfos.total.toFixed(3);
    return orderTotalInfos;
}

function getInvoiceNumber() {
    const d = new Date();
    return `${d.getUTCMonth()}${d.getUTCFullYear() % 100}${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}${d.getUTCMilliseconds()}`;
}

async function getOrderTotal(orderId) {
    const order = await getById(orderId);
    const clientId = order.client_id;
    const client = await usersService.getById(clientId);

    const rowsDetails = [];
    const rows = await orderRowsService.getByOrderId(orderId);
    for(const row of rows) {
        const productAndVariants = await productsService.getById(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        rowsDetails.push({
            product,
            variant,
            quantity: row.quantity
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
    return totalInfo;
}

async function grantPoints(orderId) {
    const totalInfo = await getOrderTotal(orderId);
    const newPoints = +client.points + +Math.floor(totalInfo.totalTTC);
    return usersService.updateClientPoints(clientId, newPoints);
}
