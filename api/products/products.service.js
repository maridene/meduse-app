const products = require('./products.model');
const manufacturers = require('./../manufacturers/manufacturers.model');
const productVariantsService = require('./productVariants.service');

module.exports = {
    getById,
    getByIdWithVariants,
    findById,
    findByCategory,
    getByCategory,
    getByReference,
    getAll,
    search,
    create,
    deleteById,
    updateById,
    lastNProducts,
    updatePinState,
    updateIsNew,
    updateIsExclusif,
    updateIsHidden,
    updateOrders,
    updateOrderIndex,
    getPinnedProducts,
    getRelatedProducts,
    getNewProducts,
    getPromoProducts,
    addQuantity,
    subQuantity,
    updateProductQuantityFromVariants
};


//admin 
function getById(id) {
    return new Promise((resolve, reject) => {
        products.getById(id).then((product) => {
            resolve(product);
        }, (err) => {
            reject(err);
        });
    });
}

function getByIdWithVariants(id) {
    return new Promise((resolve, reject) => {
        products.getById(id).then((product) => {
            if (product) {
                products.getProductVariants(id).then((variants) => {
                    resolve ({product, variants});
                }, (err) => {
                    resolve({product});
                });
                   
            } else {
                resolve();
            } 
        }, (err) => {
                reject(err);
        });
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

function getByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        products.getByCategory(categoryId)
        .then((res) => {
            manufacturers.getAll().then((manus) => {
                resolve({items: res, manufacturers: manus});
            }, (err) => {
                resolve({items: res, manufacturers: []});
            })
        }, (err) => {
            reject(err);
        });
    });
}

function getByReference(ref) {
    return new Promise((resolve, reject) => {
        products.getByRef(ref)
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

function updatePinState(id, state) {
    state = state > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
        products.updatePinState(id, state)
            .then((product) => {
                resolve(product);
            }, (err) => {
                reject(err);
            });
    });
}

function updateIsNew(id, value) {
    value = value > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
        products.updateIsNew(id, value)
            .then((product) => {
                resolve(product);
            }, (err) => {
                reject(err);
            });
    });
}

function updateIsExclusif(id, value) {
    value = value > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
        products.updateIsExclusif(id, value)
            .then((product) => {
                resolve(product);
            }, (err) => {
                reject(err);
            });
    });
}

function updateIsHidden(id, value) {
    value = value > 0 ? 1 : 0;
    return new Promise((resolve, reject) => {
        products.updateIsHidden(id, value)
            .then((product) => {
                resolve(product);
            }, (err) => {
                reject(err);
            });
    });
}

async function updateOrders(data) {
    for(const item of data) {
        await updateOrderIndex(item.id, item.orderIndex);
    }
}

function updateOrderIndex(id, orderIndex) {
    return new Promise((resolve, reject) => {
        products.updateOrderIndex(id, orderIndex)
            .then((result) => resolve(result),
            (error) => reject(error));
    });
}

async function addQuantity(id, qty) {
    const product = await getById(id);
    const newQty = +product.quantity + qty;
    return updateProductQuantity(id, newQty);
}

async function subQuantity(id, qty) {
    const product = await getById(id);
    const newQty = product.quantity - qty;
    return updateProductQuantity(id, newQty);
}

async function updateProductQuantity(id, qty) {
    return new Promise((resolve, reject) => {
        products.updateProductQuantity(id, qty)
            .then((result) => resolve(result),
            (error) => reject(error));
    });
}

async function updateProductQuantityFromVariants(productIds) {
    const doUpdate = () => {
        productIds.forEach(async (id) => {
            const variants = await productVariantsService.getByProductId(id);
            if (variants.length) {
                let newQty = 0; 
                variants.forEach((each) => newQty += each.quantity);
                await updateProductQuantity(id, newQty);
            }
        });
    } 

    setTimeout(doUpdate, 5000, 'Updating products quantity from variants...');
}

//user

function findById(id, params) {
    return new Promise((resolve, reject) => {
        products.findById(id, params).then((product) => {
            if (product) {
                products.getProductVariants(id).then((variants) => {
                    resolve ({product, variants});
                }, (err) => {
                    resolve({product});
                });
                   
            } else {
                resolve();
            } 
        }, (err) => {
                reject(err);
        });
    });
}

function findByIdWithoutVariants(id, params) {
    return new Promise((resolve, reject) => {
        products.findById(id, params).then((product) => {
            if (product) {
                resolve(product);
            } else {
                resolve();
            } 
        }, (err) => {
                reject(err);
        });
    });
}

function search(query, params) {
    return new Promise((resolve, reject) => {
        products
        .search(query, params)
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function findByCategory(categoryId, params) {
    return new Promise((resolve, reject) => {
        products.countItemsByCategory(categoryId, params).then((count) => {
            products.findByCategory(categoryId, params)
            .then((res) => {
                manufacturers.getAll().then((manus) => {
                    resolve({count: Object.values(count[0])[0], items: res, manufacturers: manus});
                }, (err) => {
                    resolve({count: Object.values(count[0])[0], items: res, manufacturers: []});
                })
            }, (err) => {
                reject(err);
            })
        }, (err) => {
            reject(err);
        }) 
    });
}

function lastNProducts(n, params) {
    return new Promise((resolve, reject) => {
        products
        .lastNProducts(n, params)
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function getPinnedProducts(params) {
    return new Promise((resolve, reject) => {
        products.pinnedProducts(params)
            .then((products) => {
                resolve(products);
            }, (err) => {
                reject(err);
            });
    });
}

function getNewProducts(params) {
    return new Promise((resolve, reject) => {
        products.getNewProducts(params)
            .then((products) => {
                resolve(products);
            }, (err) => {
                reject(err);
            });
    });
}

function getPromoProducts(params) {
    return new Promise((resolve, reject) => {
        products.getPromoProducts(params)
            .then((products) => {
                resolve(products);
            }, (err) => {
                reject(err);
            });
    });
}

function getProductsFromTags(productId, tags, params) {
    return new Promise((resolve, reject) => {
        products.getProductsFromTags(productId, tags, params)
            .then((products) => {
                resolve(products);
            }, (err) => {
                reject(err);
            });
    });
}

function getProductsInSameCategory(categoryId, productId, maxResult, ignoredIds, params) {
    return new Promise((resolve, reject) => {
        products.getProductsInSameCategory(categoryId, productId, maxResult, ignoredIds, params)
            .then((products) => {
                resolve(products);
            }, (err) => {
                reject(err);
            });
    });
}

function getRelatedProducts(id, params) {
    const relatedCount = 4;
    return new Promise((resolve, reject) => {
        findByIdWithoutVariants(id, params).then((product) => {
            if (product) {
                const tags = product.tags && product.tags.length ? product.tags.split(',') : null;
                const categoryId = product.category_id;
                if (tags) {
                    getProductsFromTags(id, tags, params).then((foundProducts) => {
                        if (foundProducts && foundProducts.length) {
                            if (foundProducts.length >= relatedCount) {
                                resolve(foundProducts.slice(0, relatedCount));
                            } else {
                                const remaining = relatedCount - foundProducts.length;
                                const ignoredIds = foundProducts.map((p) => p.id);
                                getProductsInSameCategory(categoryId, id, remaining, ignoredIds, params)
                                    .then((result) =>{
                                        resolve([...foundProducts, ...result]);
                                    }, (err) => {
                                        reject();
                                    })
                            }
                        } else {
                            getProductsInSameCategory(categoryId, id,  relatedCount, [], params)
                                .then((result) => resolve(result),
                                (err) => reject(err));
                        }
                        
                    }, (error) => {
                        getProductsInSameCategory(categoryId, id, relatedCount, [], params)
                        .then((result) => resolve(result),
                            (err) => reject(err));
                    });
                } else {
                    getProductsInSameCategory(categoryId, id, relatedCount, [], params)
                        .then((result) => resolve(result),
                        (err) => reject(err));
                }
            } else {
                reject();
            }
        }, (error) => reject(error));
    });
}
