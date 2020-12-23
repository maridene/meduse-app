const express = require('express');
const path = require("path");
const router = express.Router();
const invoicesService = require('./invoices.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

router.get('/', authorize(Role.Admin), getAll);
router.get('/invoices', authorize(Role.Admin), getInvoices);
router.get('/shipping', authorize(Role.Admin), getShippingInvoices);

module.exports = router;

function getAll(req, res, next) {
    invoicesService.getAll()
        .then(result => res.json(result))
        .catch(err => next(err));
}

function getInvoices(req, res, next) {
    invoicesService.getInvoices()
        .then(result => res.json(result))
        .catch(err => next(err));
}

function getShippingInvoices(req, res, next) {
    invoicesService.getShippingInvoices()
        .then(result => res.json(result))
        .catch(err => next(err));
}
