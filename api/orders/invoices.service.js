const fs = require('fs');
const path = require("path");
require('dotenv').config({ path: __dirname + '/.env'});
const constants = require("../config/constants");
const { padNumber } = require("../utils");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const utils = require('../utils');
const { v4: uuidv4 } = require('uuid');

const ordersService = require('./orders.service');
const usersService = require('../users/user.service');
const settingsService = require('../settings/settings.service');
const orderRowsService = require('../orderRows/orderRows.service');
const productsService = require('../products/products.service');
const productVariantsService = require('../products/productVariants.service');
const agentService = require('../agent/agent.service');

const dev = process.env.dev === '1';
const invoicesPath = dev ? "public/invoices" : constants.INVOICES_PATH;
const templateUrl = dev ? "meduse-app/api/orders" : "orders";

const browserParams = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,    
}
if (dev) {
    browserParams.executablePath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
}

async function generatePdf(html, pdfPath) {
    const pdfOptions = Object.assign({}, PDF_OPTIONS, {path: pdfPath});
    const browser = await puppeteer.launch(browserParams);
    const page = await browser.newPage();
    await page.setContent(html);
    await page.addStyleTag({ path: path.join(__dirname, 'style.css') });
	await page.pdf(pdfOptions);
    await browser.close();
}

const headerTemplate = "<p></p>";
const footerTemplate = "<div style=\" background: #999; width: 100%; font-size: 8px; line-height: 1px; color: #999; text-align: center;\">" +
"<p>Tél: +216 22 55 93 06 - E-mail: contact@meduse.tn | Site web: https://www.meduse.tn </p>" + 
"<p>Résidence Narjess, Les jardins d'El Aouina, 2036 Tunis | MF:1674042 / N / B / M / 000 | RIB BH : 14093093101700105713 </p>" + 
"</div>";

const PDF_OPTIONS = {
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    displayHeaderFooter: true,
    printBackground: true,
    format: 'A4',
    margin: { 
        top: "30px", 
        bottom: "60px",
        right: "12px",
        left: "12px"
    }
};

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('ifNotZero', function(arg1, options) {
    return (arg1 && arg1 > 0) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('ifNotNull', function(arg1, options) {
    return (arg1 && arg1.length) ? options.fn(this) : options.inverse(this);
});

module.exports = {
    getAll,
    getInvoices,
    getShippingInvoices,
    getCreditInvoices,
    getDevisInvoices,
    generateInvoice,
    generateDeliveryInvoice,
    generateCreditInvoice,
    generateDevisInvoice,
    deleteInvoices
};

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
                        number: `${splited[6]}-${splited[7]}`,
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
                        number: `${splited[6]}-${splited[7]}`,
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
                        number: `${splited[6]}-${splited[7]}`,
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

function getDevisInvoices() {
    return new Promise((resolve, reject) => {
        fs.readdir(invoicesPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const result = files.filter((each) => each.split('-')[0] === 'Devis')
                .map((each) => {
                    const splited = each.split('.')[0].split('-');
                    return {
                        number: `${splited[6]}-${splited[7]}`,
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

async function getDataForInvoice(orderId, date, mf, invoiceType) {
    const lines = [];
    const order = await ordersService.getById(orderId);
    const client = await usersService.getById(order.client_id);
    const agent = order.agent_id ? await agentService.getById(order.agent_id) : null;
    const isPremium = client.premium === 1;
    const shippingSettings = await settingsService.getByType('shipping');
    const shippingData = {};
    shippingSettings.forEach((i) => shippingData[i.label] = i.value);

    const deliveryAddress = {
        address: order.delivery_address,
        zipcode: order.delivery_zipcode,
        city: order.delivery_city,
        state: order.delivery_state,
        phone: order.delivery_phone
    };
    const billingAddress = {
        address: order.billing_address,
        zipcode: order.billing_zipcode,
        city: order.billing_city,
        state: order.billing_state,
        phone: order.billing_phone
    };

    const rows = await orderRowsService.getByOrderId(orderId);
    for(const row of rows) {
        const productAndVariants = await productsService.getByIdWithVariants(row.product_id);
        const product = productAndVariants.product;
        const variant = row.variant_id !== null ? await productVariantsService.getById(row.variant_id) : null;
        const label = variant ? `${product.label}${variant.color ? ' - ' + variant.color: ''}${variant.size ? ' - ' + variant.size: ''}`
            : product.label
        let price;
        if (row.price) {
            price = row.price;
        } else {
            price = product.promo_price ? product.promo_price : product.price;
        }
        const tva = product.tva || 0;
        const priceHT = (price / (100 + tva)) * 100;
        const reduction = row.reduction || 0;
        const hasReduction = reduction !== 0;
        const reductionAmount = hasReduction ? (priceHT * reduction) / 100 : 0;
        const priceHTAfterRed = +priceHT - reductionAmount;
        const tvaUAmount = (priceHTAfterRed / 100) * tva;
        const tvaAmount = tvaUAmount * row.quantity;
        const totalHT = priceHTAfterRed * row.quantity;

        lines.push({
            id: product.id,
            label,
            quantity: row.quantity,
            priceHT,
            priceHTLabel: `${priceHT.toFixed(3)} D.T`,
            hasReduction,
            reduction: hasReduction ? reductionAmount : 0,
            reductionLabel: hasReduction ? `${reductionAmount.toFixed(3)} D.T (${reduction}%)` : '',
            totalHT,
            totalHTLabel: `${totalHT.toFixed(3)} D.T`,
            tva,
            tvaAmount,
            tvaLabel : `${product.tva}%`
        });
    }

    const shippingCost = getShippingCost(shippingData, isPremium, lines);
    if (shippingCost > 0) {
        const tvaHT = (shippingCost / 107) * 100;
        const tvaAmount = (shippingCost * 7) / 100;
        
        const shippingLine = {id: 0, label: `Livraison`, tvaLabel: '7%', priceHT: tvaHT, priceHTLabel: `${tvaHT.toFixed(3)} D.T`, totalHT: tvaHT, tva: 7, hasReduction: false, 
        totalHTLabel: `${tvaHT.toFixed(3)} D.T`, quantity: 1, tvaAmount, priceTTC: shippingCost};
        lines.push(shippingLine);
    }

    const totalInfos = getOrderTotal(lines);

    const tvaRows = [];

    lines.forEach((line) => {
        const index = tvaRows.map((i)=> i.tva).indexOf(line.tva);
        if (index >= 0) {
            tvaRows[index].base = +tvaRows[index].base + line.totalHT;
        } else {
            tvaRows.push({tva: line.tva, base: line.totalHT});
        }
    });

    tvaRows.forEach((each) => {
        each.amount = (each.base / 100) * each.tva;
        each.tvaLabel = `${each.tva} %`;
        each.baseLabel = each.base.toFixed(3);
        each.amountLabel = each.amount.toFixed(3);
    });

    let num;
    switch(invoiceType) {
        case 'delivery':
            num = await getDeliveryInvoiceNumber();
            break;
        case 'credit':
            num = await getCreditInvoiceNumber();
            break;
        case 'devis':
            num = await getDevisInvoiceNumber();
            break;
        default:
            num = await getInvoiceNumber();
            break; 
    }

    const year = new Date().getUTCFullYear();
    const data = {
        invoiceNumber: `${year}-${num}`,
        creationDate: date,
        order,
        lines,
        tvaRows,
        deliveryAddress,
        billingAddress,
        client,
        totalInfos,
        totalText: utils.NumberToLetter(Number.parseFloat(totalInfos.total.toFixed(3)), 'dinars', 'millimes'),
        points: Math.floor(totalInfos.totalTTC),
        mf,
        agent: agent ? agent.name : null
    };

    return data;
}

async function generateInvoice(orderId, date, mf) {

    const data = await getDataForInvoice(orderId, date, mf);
    const templateHtml = fs.readFileSync(path.join(process.cwd(), templateUrl + '/invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const year = new Date().getUTCFullYear();
    const random = uuidv4();
    const filename = `Facture-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}-${random}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

async function generateDeliveryInvoice(orderId, date, mf) {
    
    const data = await getDataForInvoice(orderId, date, mf, 'delivery');
    const templateHtml = fs.readFileSync(path.join(process.cwd(), templateUrl + '/delivery-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const year = new Date().getUTCFullYear();
    const random = uuidv4();
    const filename = `BonDeCommande-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}-${random}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

async function generateCreditInvoice(orderId, date, mf) {
    
    const data = await getDataForInvoice(orderId, date, mf, 'credit');
    const templateHtml = fs.readFileSync(path.join(process.cwd(), templateUrl + '/credit-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);
    
    const year = new Date().getUTCFullYear();
    const random = uuidv4();
    const filename = `FactureAvoir-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}-${random}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

async function generateDevisInvoice(orderId, date, mf) {

    const data = await getDataForInvoice(orderId, date, mf, 'devis');
    const templateHtml = fs.readFileSync(path.join(process.cwd(), templateUrl + '/devis-invoice.html'), 'utf8');
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    const year = new Date().getUTCFullYear();
    const random = uuidv4();
    const filename = `Devis-${data.order.order_ref}-${orderId}-${year}-${data.invoiceNumber}-${random}.pdf`;
    const pdfPath = path.join(invoicesPath, filename);

    await generatePdf(html, pdfPath);
    return filename;
}

function getShippingCost(shippingData, isPremium, lines) {
    if (isPremium) {
        return 0;
    } else if (shippingData.free === '1') {
        return 0;
    } else {
        let total = 0;
        lines.forEach((line) => {
            total = +total + line.totalHT + line.tvaAmount;
        });
        return total >= parseFloat(shippingData.freeFrom) ? 0 : parseFloat(shippingData.shippingFee);
    }
}

function getOrderTotal(lines) {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    lines.forEach((line) => {
        totalHT = +totalHT + line.totalHT;
        totalTVA = +totalTVA + line.tvaAmount;
        totalTTC = +totalTTC + (+line.totalHT + line.tvaAmount);
    });

    const total = totalTTC + constants.TF_VALUE;

    return {
        totalHT,
        totalHTLabel: `${totalHT.toFixed(3)} D.T`,
        totalTVA,
        totalTVALabel: `${totalTVA.toFixed(3)} D.T`,
        totalTTC,
        totalTTCLabel: `${totalTTC.toFixed(3)} D.T`,
        total,
        totalLabel: `${total.toFixed(3)} D.T TTC`
    }
}

async function getInvoiceNumber() {
    const num = await settingsService.getAndIncrementInvoiceNumber();
    return padNumber(num, 6);
}

async function getDeliveryInvoiceNumber() {
    const num = await settingsService.getAndIncrementDeliveryInvoiceNumber();
    return padNumber(num, 6);
}

async function getCreditInvoiceNumber() {
    const num = await settingsService.getAndIncrementCreditInvoiceNumber();
    return padNumber(num, 6);
}

async function getDevisInvoiceNumber() {
    const num = await settingsService.getAndIncrementDevisInvoiceNumber();
    return padNumber(num, 6);
}

async function deleteInvoices(files) {
    return Promise.all(
        files.map((file) =>
            new Promise((resolve, reject) => {
                      try {
                        fs.unlink(`${invoicesPath}/${file}`, err => {
                          if (!err) {
                            console.log(`${file} was deleted`);
                            resolve({status: 'deleted', file})
                          } else {
                            console.log(`no such file: ${file}`);
                            resolve({status: 'not deleted', file})
                          }
                        });
                      } catch(err) {
                          throw err;
                      }
                    })
        )
    )
}
