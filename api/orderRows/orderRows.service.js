const orderRows = require('./orderRows.model');

module.exports = {
    getById,
    getByOrderId,
    getByProductId,
    add,
    addAll,
    removeById,
    removeByProductId,
    updateById
}

function getById(id) {
    return new Promise((resolve, reject) => {
        orderRows.getById(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function getByOrderId(id) {
    return new Promise((resolve, reject) => {
        orderRows.getByOrderId(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function getByProductId(id) {
    return new Promise((resolve, reject) => {
        orderRows.getByProductId(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function add(row) {
    return new Promise((resolve, reject) => {
        orderRows.add(row)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function addAll(rows) {
    return new Promise((resolve, reject) => {
        orderRows.addAll(rows)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function removeById(id) {
    return new Promise((resolve, reject) => {
        orderRows.removeById(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function removeByProductId(id) {
    return new Promise((resolve, reject) => {
        orderRows.removeByProductId(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}

function updateById(id, newRow) {
    return new Promise((resolve, reject) => {
        orderRows.updateById(id, newRow)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}
