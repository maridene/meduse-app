const categories = require('./categories.model');

module.exports = {
    create,
    findById,
    updateById,
    getAll,
    remove,
    updateOrders
};

function getAll() {
    return new Promise((resolve, reject) => {
        categories
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function create(newCategory) {
    return new Promise((resolve, reject) => {
        categories.create(newCategory)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        categories
        .findById(id)
        .then((result) => {
            resolve(result);
        }, (err) => {
            reject(err);
        });
    });
}

function updateById(id, newCategory) {
    return new Promise((resolve, reject) => {
        categories.updateById(id, newCategory)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        categories.remove(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

async function updateOrders(data) {
    for(const item of data) {
        await updateOrderIndex(item.id, item.order);
    }
}

function updateOrderIndex(id, order) {
    return new Promise((resolve, reject) => {
        categories.updateOrderIndex(id, order)
            .then((result) => resolve(result),
            (error) => reject(error));
    });
}
