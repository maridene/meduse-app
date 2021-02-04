const orders = require('./orders.model');
const ordersService = require('./orders.service');

module.exports = {
    findDoneAndPaidByMonth,
    findCreatedOrdersByMonth
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

