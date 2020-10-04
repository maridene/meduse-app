const products = require('./products.model');
const productVariantsService = require('./productVariants.service');

module.exports = {
    findById,
    findByCategory,
    findByReference,
    getAll,
    create,
    deleteById,
    updateById
};

function findById(id) {
    return new Promise((resolve, reject) => {
        products.findById(id).then((product) => {
            if (product) {
                products.getProductVariants(id).then((variants) => {
                    resolve ({product, variants});
                }, (err) => {
                    console.log(err);
                    resolve({product});
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

function create(product) {
    return new Promise((resolve, reject) => {
        products.create(product)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        productVariantsService.deleteByProductId(id)
            .then(() => {
                products.deleteById(id)
                    .then((result) => {
                        resolve(result);
                    }, (error) => {
                        reject(error);
                    })
            }, (err) => {
                reject(err);
            });
    });   
}

function updateById(id, product) {
    return new Promise((resolve, reject) => {
        const modificationDate = new Date();
        product.modificationDate = modificationDate;
        products.updateById(id, product)
        .then((result) =>  {
            resolve(result);
        }, (error) => {
            reject(error);
        });   
    });
}
