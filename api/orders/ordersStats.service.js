const orders = require('./orders.model');
const ordersService = require('./orders.service');

module.exports = {
    findDoneAndPaidByMonth,
    findCreatedOrdersByMonth,
    findAllOrdersByMonth
};

async function findDoneAndPaidByMonth(yearMonth) {
    const result = {month: yearMonth, orders: []};
    const doneOrders = await orders.findDoneAndPaidByMonth(yearMonth);
    if (doneOrders && doneOrders.length) {
        for (const o of doneOrders) {
            const totalInfos = await ordersService.getOrderTotal(o.id);
            result.orders.push({order: o, totalInfos});
        }
    }

    return result;
}

async function findCreatedOrdersByMonth(yearMonth) {
    const result = {month: yearMonth, orders: []};
    const createdOrders = await orders.findCreatedOrdersByMonth(yearMonth);
    result.orders = createdOrders;
    return result;
}

async function findAllOrdersByMonth(yearMonth) {
    const result = {month: yearMonth, orders: []};
    const createdOrders = await orders.findCreatedNotCanceledOrdersByMonth(yearMonth);
    if (createdOrders && createdOrders.length) {
        for (const o of createdOrders) {
            const totalInfos = await ordersService.getOrderTotal(o.id);
            result.orders.push({order: o, totalInfos});
        }
    }
    return result;
}

