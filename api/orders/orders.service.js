const orders = require('./orders.model');
const orderRowsService = require('./../orderRows/orderRows.service');
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
    updateById
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
    return new Promise((resolve, reject) => {
        orders.updateById(id, newOrder)
            .then((result) => resolve(result),
            (err) => reject(err));
    });
}

function submitOrder(userId, orderDetails) {
    const order = {
        client_Id: userId,
        order_date: new Date(),
        client_message: orderDetails.client_message,
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
