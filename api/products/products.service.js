const products = require('./products.model');

module.exports = {
    findById,
    findByCategory,
    findByReference,
    getAll
};

function findById(id) {
    return new Promise((resolve, reject) => {
        products.findById(id).then((product) => {
            if (product) {
                products.getProductImages(product.sku).then((images) => {
                    products.getProductVariants(id).then((variants) => {
                        resolve ({product, variants, images});
                    }, (err) => {
                        console.log(err);
                        resolve({product, images});
                    })
                }, (err) => {
                    products.getProductVariants(id).then((variants) => {
                        resolve ({product, variants});
                    }, (err) => {
                        console.log(err);
                        resolve(product);
                    })
                });
            } else {
                console.log(`no product found with id = ${id}`);
                resolve();
            }
        }), (err) => {
                reject(err);
            }
        });
}

function getAll() {
    return new Promise((resolve, reject) => {
        products
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function findByCategory(categoryId, startAt, maxResult, orderBy) {
    return new Promise((resolve, reject) => {
        products.countItemsByCategory(categoryId).then((count) => {
            products.findByCategory(categoryId, startAt, maxResult, orderBy)
            .then((res) => {
                resolve({count: Object.values(count[0])[0], items: res});
            }, (err) => {
                reject(err);
            })
        }, (err) => {
            reject(err);
        }) 
    });
}

function findByReference(ref) {
    return new Promise((resolve, reject) => {
        products.findByRef(ref)
            .then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
    });
}
