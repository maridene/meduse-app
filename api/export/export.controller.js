const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const Role = require('helpers/role');
const userService = require('../users/user.service');
const productService = require('../products/products.service');
const ExportService = require('./export.service');

//admin routes
router.get('/clients/:format', authorize(Role.Admin), exoportClients);
router.get('/products/:format', authorize(Role.Admin), exportProducts);
router.post('/orders/:format', authorize(Role.Admin), exportOrders);

module.exports = router;

function exoportClients(req, res, next) {
    const format = req.params.format === 'csv' || 'mexcel' ? req.params.format : 'csv';
    userService.getClients().then((data) => {
        let clients = [];
    
        data.forEach((client) => {
          const { password, role, ...clientWithoutPassword } = client;
          clients.push(clientWithoutPassword);
        });

		ExportService.buildClientsResponse(res, data, format);
    });
}

function exportOrders(req, res, next) {

}

function exportProducts(req, res, next) {
    productService.getAll().then((data) => {
        let products = [];
    
        data.forEach((p) => {
          const { images, extendCategories, ...product } = p;
          products.push(product);
        });
    
        const csvFields = ["id", "sku", "label", "description", "price", "tva", "quantity", "lowStckThreshold", "category id", "long description", "promo_price", "manufacturerId", "weight", "video link", "tags", "creation date", "modification date", "pinned", "isNew", "isExclusif", "isHidden", "orderIndex"];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(products);
    
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    
        res.status(200).end(csvData);
    });
}