const fs = require('fs');
const constants = require("../config/constants");

const dev = process.env.dev === '1';

const invoicesPath = dev ? "public/invoices" : constants.INVOICES_PATH;

module.exports = {
    getAll,
    getInvoices,
    getShippingInvoices,
    getCreditInvoices
};
/*
{
    __filename,
    url,
    date,
    refCommande
}
*/
function getAll() {
    return new Promise((resolve, reject) => {
        fs.readdir(invoicesPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const result = files.map((each) => {
                    const splited = each.split('.')[0].split('-');
                    return {
                        type: splited[0],
                        number: `${splited[splited.length-1]}-${splited[splited.length-2]}`,
                        filename: each,
                        orderRef: `${splited[1]}-${splited[2]}-${splited[3]}`,
                        orderId: splited[4]
                    }
                });
                resolve(result);
            }
        })
    })
}

function getInvoices() {
    return new Promise((resolve, reject) => {
        fs.readdir(invoicesPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const result = files.filter((each) => each.split('-')[0] === 'Facture')
                .map((each) => {
                    const splited = each.split('.')[0].split('-');
                    return {
                        number: `${splited[splited.length-1]}-${splited[splited.length-2]}`,
                        filename: each,
                        orderRef: `${splited[1]}-${splited[2]}-${splited[3]}`,
                        orderId: splited[4]
                    }
                });
                resolve(result);
            }
        })
    })
}

function getShippingInvoices() {
    return new Promise((resolve, reject) => {
        fs.readdir(invoicesPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const result = files.filter((each) => each.split('-')[0] === 'BonDeCommande')
                .map((each) => {
                    const splited = each.split('.')[0].split('-');
                    return {
                        number: `${splited[splited.length-1]}-${splited[splited.length-2]}`,
                        filename: each,
                        orderRef: `${splited[1]}-${splited[2]}-${splited[3]}`,
                        orderId: splited[4]
                    }
                });
                resolve(result);
            }
        })
    })
}

function getCreditInvoices() {
    return new Promise((resolve, reject) => {
        fs.readdir(invoicesPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const result = files.filter((each) => each.split('-')[0] === 'FactureAvoir')
                .map((each) => {
                    const splited = each.split('.')[0].split('-');
                    return {
                        number: `${splited[splited.length-1]}-${splited[splited.length-2]}`,
                        filename: each,
                        orderRef: `${splited[1]}-${splited[2]}-${splited[3]}`,
                        orderId: splited[4]
                    }
                });
                resolve(result);
            }
        })
    })
}
