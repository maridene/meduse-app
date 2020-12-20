
const settings = require('./settings.model');

module.exports = {
    getByLabel,
    getByType,
    getAll,
    updateByLabel,
    getAndIncrementInvoiceNumber,
    getAndIncrementDeliveryInvoiceNumber
};

function getByLabel(label) {
    return new Promise((resolve, reject) => {
        settings.getByLabel(label)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function getByType(type) {
    return new Promise((resolve, reject) => {
        settings.getByType(type)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        settings.getAll()
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function updateByLabel(label, value) {
    return new Promise((resolve, reject) => {
        settings.updateByLabel(label, value)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

async function getAndIncrementInvoiceNumber() {
    const numObject = await getByLabel('lastInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('lastInvoice', num + 1);
    return num;
}

async function getAndIncrementDeliveryInvoiceNumber() {
    const numObject = await getByLabel('lastDeliveryInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('lastDeliveryInvoice', num + 1);
    return num;
}
