const manufacturers = require('./manufacturers.model');

module.exports = {
    create,
    findById,
    updateById,
    getAll,
    remove
};

function getAll() {
    return new Promise((resolve, reject) => {
        manufacturers
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function create(newManufacturer) {
    return new Promise((resolve, reject) => {
        manufacturers.create(newManufacturer)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        manufacturers
        .findById(id)
        .then((result) => {
            manufacturers.getProductsCountForManufacturer(id)
            .then((count) => {
                resolve(Object.assign({}, result, {productsCount: count}));
            })
            
        }, (err) => {
            reject(err);
        });
    });
}

function updateById(id, newManufacturer) {
    return new Promise((resolve, reject) => {
        manufacturers.updateById(id, newManufacturer)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        manufacturers.remove(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}
