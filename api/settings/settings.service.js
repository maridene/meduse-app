
const settings = require('./settings.model');

module.exports = {
    getByLabel,
    getByType,
    getAll,
    updateByLabel,
    getAndIncrementInvoiceNumber,
    getAndIncrementDeliveryInvoiceNumber,
    getAndIncrementCreditInvoiceNumber,
    getAndIncrementDevisInvoiceNumber
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
    const numObject = await getByLabel('nextInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('nextInvoice', num + 1);
    return num;
}

async function getAndIncrementDeliveryInvoiceNumber() {
    const numObject = await getByLabel('nextDeliveryInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('nextDeliveryInvoice', num + 1);
    return num;
}

async function getAndIncrementCreditInvoiceNumber() {
    const numObject = await getByLabel('nextCreditInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('nextCreditInvoice', num + 1);
    return num;
}

async function getAndIncrementDevisInvoiceNumber() {
    const numObject = await getByLabel('nextDevisInvoice');
    const num = parseInt(numObject.value);
    updateByLabel('nextDevisInvoice', num + 1);
    return num;
}
