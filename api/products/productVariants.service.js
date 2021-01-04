const productVariants = require('./productVariants.model');

module.exports = {
    create,
    deleteById,
    updateById,
    getByProductId,
    getById,
    deleteByProductId,
    addQuantity,
    subQuantity
};

function create(productVariant) {
    return new Promise((resolve, reject) => {
        productVariants.create(productVariant)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        productVariants.deleteById(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
};

function updateById(id, pVariant) {
    return new Promise((resolve, reject) => {
        productVariants.updateById(id, pVariant)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function getByProductId(id) {
    return new Promise((resolve, reject) => {
        productVariants.getByProductId(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        productVariants.getById(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function deleteByProductId(id) {
    return new Promise((resolve, reject) => {
        productVariants.deleteByProductId(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

async function addQuantity(id, qty) {
    const variant = await getById(id);
    const newQty = variant.quantity + qty;
    return updateProductVariantQuantity(id, newQty);
}

async function subQuantity(id, qty) {
    const variant = await getById(id);
    const newQty = variant.quantity - qty;
    return updateProductVariantQuantity(id, newQty);
}

async function updateProductVariantQuantity(id, qty) {
    return new Promise((resolve, reject) => {
        productVariants.updateProductVariantQuantity(id, qty)
            .then((result) => resolve(result),
            (error) => reject(error));
    });
}
