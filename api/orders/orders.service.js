const orders = require('./orders.model');
const orderRowsService = require('./../orderRows/orderRows.service');
const usersService = require('./../users/user.service');
const productsService = require('./../products/products.service');
const productVariantsService = require("./../products/productVariants.service");
const couponsService = require('./../coupons/coupons.service');
const settingsService = require("../settings/settings.service");
const mailService = require('../mailing/mail.service');

const constants = require('../config/constants');

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
    getOrderTotal,
    updateAgent
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
        order.total = totalInfos.totalInfos.totalLabel;
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
    const oldPaymentStatus = parseInt(order.payment_status);
    const newPaymentStatus = parseInt(newOrder.payment_status);
    const oldStatus = order.order_status;

    if(newOrder.order_status === 'shipped') {
        newOrder.shipped_date = new Date();
    } else if (newOrder.order_status === 'canceled') {
        newOrder.canceled_date = new Date(); 
    }
    
    return new Promise((resolve, reject) => {
        orders.updateById(id, newOrder)
            .then(async (result) => {
                if(newPaymentStatus !== oldPaymentStatus) {
                    if (newPaymentStatus === 1) {
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

async function getOrderTotal(orderId) {
    const lines = [];
    const order = await getById(orderId);
    const client = await usersService.getById(order.client_id);
    const isPremium = client.premium === 1;
    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const rows = await orderRowsService.getByOrderId(orderId) || [];

    for(const row of rows) {
        const productAndVariants = await productsService.getByIdWithVariants(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        const label = variant ? `${product.label}${variant.color ? ' - ' + variant.color: ''}${variant.size ? ' - ' + variant.size: ''}`
            : product.label
        let price;
        if (row.price) {
            price = row.price;
        } else {
            price = product.promo_price ? product.promo_price : product.price;
        }
        const tva = product.tva || 0;
        const priceHT = (price / (100 + tva)) * 100;
        const reduction = row.reduction || 0;
        const hasReduction = reduction !== 0;
        const reductionAmount = hasReduction ? (priceHT * reduction) / 100 : 0;
        const priceHTAfterRed = +priceHT - reductionAmount;
        const tvaUAmount = (priceHTAfterRed / 100) * tva;
        const tvaAmount = tvaUAmount * row.quantity;
        const totalHT = priceHTAfterRed * row.quantity;

        lines.push({
            id: product.id,
            label,
            quantity: row.quantity,
            priceHT,
            priceHTLabel: `${priceHT.toFixed(3)} D.T`,
            hasReduction,
            reduction: hasReduction ? reductionAmount : 0,
            reductionLabel: hasReduction ? `${reductionAmount.toFixed(3)} D.T (${reduction}%)` : '',
            totalHT,
            totalHTLabel: `${totalHT.toFixed(3)} D.T`,
            tva,
            tvaAmount,
            tvaLabel : `${product.tva}%`
        });
    }

    const shippingCost = getShippingCost(shippingData, isPremium, lines);
    if (shippingCost > 0) {
        const tvaHT = (shippingCost / 107) * 100;
        const tvaAmount = (shippingCost * 7) / 100;
        
        const shippingLine = {id: 0, label: `Livraison`, tvaLabel: '7%', priceHT: tvaHT, priceHTLabel: `${tvaHT.toFixed(3)} D.T`, totalHT: tvaHT, tva: 7, hasReduction: false, 
        totalHTLabel: `${tvaHT.toFixed(3)} D.T`, quantity: 1, tvaAmount, priceTTC: shippingCost};
        lines.push(shippingLine);
    }

    const totalInfos = getOrderTotalFromLines(lines);

    const tvaRows = [];

    lines.forEach((line) => {
        const index = tvaRows.map((i)=> i.tva).indexOf(line.tva);
        if (index >= 0) {
            tvaRows[index].base = +tvaRows[index].base + line.totalHT;
        } else {
            tvaRows.push({tva: line.tva, base: line.totalHT});
        }
    });

    tvaRows.forEach((each) => {
        each.amount = (each.base / 100) * each.tva;
        each.tvaLabel = `${each.tva} %`;
        each.baseLabel = each.base.toFixed(3);
        each.amountLabel = each.amount.toFixed(3);
    });

    const data = {
        order,
        lines,
        tvaRows,
        totalInfos,
        points: Math.floor(totalInfos.totalTTC)
    };

    return data;
}

function getShippingCost(shippingData, isPremium, lines) {
    if (isPremium) {
        return 0;
    } else if (shippingData.free === '1') {
        return 0;
    } else {
        let total = 0;
        lines.forEach((line) => {
            total = +total + line.totalHT + line.tvaAmount;
        });
        return total >= parseFloat(shippingData.freeFrom) ? 0 : parseFloat(shippingData.shippingFee);
    }
}

function getOrderTotalFromLines(lines) {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    lines.forEach((line) => {
        totalHT = +totalHT + line.totalHT;
        totalTVA = +totalTVA + line.tvaAmount;
        totalTTC = +totalTTC + (+line.totalHT + line.tvaAmount);
    });

    const total = totalTTC + constants.TF_VALUE;

    return {
        totalHT,
        totalHTLabel: `${totalHT.toFixed(3)} D.T`,
        totalTVA,
        totalTVALabel: `${totalTVA.toFixed(3)} D.T`,
        totalTTC,
        totalTTCLabel: `${totalTTC.toFixed(3)} D.T`,
        total,
        totalLabel: `${total.toFixed(3)} D.T TTC`
    }
}

async function grantPoints(order) {
    const orderTotal = await getOrderTotal(order.id);
    const client = order ? await usersService.getById(order.client_id) : null;
    if (client && orderTotal && orderTotal.totalInfos) {
        const newPoints = +client.points + +Math.floor(orderTotal.totalInfos.totalTTC);
        usersService.updateClientPoints(client.id, newPoints);
    } else {
        console.error('[ordersService.grantPoints]: failed to grant points to client');
    }
    
}

async function retrievePoints(order) {
    const orderTotal = await getOrderTotal(order.id);
    const client = order ? await usersService.getById(order.client_id) : null;
    if (client && orderTotal && orderTotal.totalInfos) {
        const newPoints = +client.points - +Math.floor(orderTotal.totalInfos.totalTTC);
        usersService.updateClientPoints(client.id, newPoints);
    } else {
        console.error('[ordersService.retrievePoints]: failed to retrieve points from client');
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

function updateAgent(orderId, agentId) {
    return new Promise((resolve, reject) => {
        orders.updateAgent(orderId, agentId)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}
