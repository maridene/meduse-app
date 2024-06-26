const express = require('express');
const router = express.Router();
const ordersService = require('./orders.service');
const invoicesService = require('./invoices.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

/**
 * Order statuses:
 *  - new : Nouvelle
 *  - confirmed : confirmée
 *  - in progress : en cours de traitement
 *  - shipping: en livraison
 *  - shipped-payed: livrée payée
 *  - shipped-unpayed: livrée non payée
 *  - canceled: annulée
*/

// public routes

//admin routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/search', authorize(Role.Admin), search);
router.get('/pending', authorize(Role.Admin), getPendingOrders);
router.get('/client/:id', authorize(Role.Admin), getByClientId);
router.get('/:id', authorize(Role.Admin), getById);
router.post('/', authorize(Role.Admin), createOrder);
router.put('/:id', authorize(Role.Admin), updateById);
router.put('/status/:id', authorize(Role.Admin), updateOrderStatus);
router.post('/:id/invoice', authorize(Role.Admin), generateInvoice);
router.post('/:id/deliveryInvoice', authorize(Role.Admin), generateDeleveryInvoice);
router.post('/:id/creditInvoice', authorize(Role.Admin), generateCreditInvoice);
router.post('/:id/devisInvoice', authorize(Role.Admin), generateDevisInvoice);
router.get('/:id/total', authorize(Role.Admin), getOrderTotal);
router.post('/:id/reduction/apply', authorize(Role.Admin), applyReduction);
router.post('/:id/reduction/cancel', authorize(Role.Admin), cancelReduction);
router.put('/:id/agent', authorize(Role.Admin), updateAgent);

// all authenticated users routes
router.post('/submit', authorize(Role.User), submitOrder);
router.get('/myorders/:id', authorize(Role.User), getMyOrders);
router.get('/myorder/:id', authorize(Role.User), getMyOrder);

module.exports = router;

function getAll(req, res, next) {
    ordersService.getAll()
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function getPendingOrders(req, res, next) {
    ordersService.findByStatus('in_progress')
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function search(req, res, next) {
    const status = req.query.status && req.query.status.length ? req.query.status : null;
    const payment = parseInt(req.query.payment) === 0 || parseInt(req.query.payment) === 1 ? parseInt(req.query.payment) : null;
    const ptype = req.query.ptype && req.query.ptype === 'e' || req.query.ptype === 'c' ? req.query.ptype : null;
    ordersService.search(status, payment, ptype)
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function findByStatus(req, res, next) {
    const status = req.params.status;
    ordersService.findByStatus(status)
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    ordersService.getById(id)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function createOrder(req, res, next) {
    const userId = parseInt(req.header('userId')); 
    const orderDetails = req.body;
    ordersService.createOrder(userId, orderDetails)
        .then(order => order ? res.json(order) : res.status(400).json({message : 'error occured while creating order'}))
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    const newOrder = req.body;
    ordersService.updateById(id, newOrder)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function updateOrderStatus(req, res, next) {
    const id = parseInt(req.params.id);
    const newStatus = req.body.status;
    ordersService.updateOrderStatus(id, newStatus)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function submitOrder(req, res, next) {
    const userId = parseInt(req.header('userId'));
    const orderDetails = req.body;

    ordersService.submitOrder(userId, orderDetails)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function getMyOrders(req, res, next) {
    const headerUserId = parseInt(req.header('userId'));
    const paramUserId = parseInt(req.params.id);

    ordersService.findByClientId(headerUserId, paramUserId)
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function getByClientId(req, res, next) {
    const clientId = parseInt(req.params.id);

    ordersService.findByClientId(clientId)
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function getMyOrder(req, res, next) {
    const headerUserId = parseInt(req.header('userId'));
    const orderId = parseInt(req.params.id);

    ordersService.findMyOrderById(headerUserId, orderId)
        .then(result => res.json(result))
        .catch(err => next(err));
}

function generateInvoice(req, res, next) {
    const orderId = parseInt(req.params.id);
    const date = req.body.date;
    const mf = req.body.mf;
    invoicesService.generateInvoice(orderId, date, mf)
        .then(filename => {
            res.json({filename: filename});
        })
        .catch(err => next(err));
}

function generateDeleveryInvoice(req, res, next) {
    const orderId = parseInt(req.params.id);
    const date = req.body.date;
    const mf = req.body.mf;
    invoicesService.generateDeliveryInvoice(orderId, date, mf)
        .then(filename => {
            res.json({filename: filename});
        })
        .catch(err => next(err));
}

function generateCreditInvoice(req, res, next) {
    const orderId = parseInt(req.params.id);
    const date = req.body.date;
    const mf = req.body.mf;
    invoicesService.generateCreditInvoice(orderId, date, mf)
        .then(filename => {
            res.json({filename: filename});
        })
        .catch(err => next(err));
}

function generateDevisInvoice(req, res, next) {
    const orderId = parseInt(req.params.id);
    const date = req.body.date;
    const mf = req.body.mf;
    invoicesService.generateDevisInvoice(orderId, date, mf)
        .then(filename => {
            res.json({filename: filename});
        })
        .catch(err => next(err));
}

function getOrderTotal(req, res, next) {
    const orderId = parseInt(req.params.id);
    ordersService.getOrderTotal(orderId)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}

function applyReduction(req, res, next) {
    const orderId = parseInt(req.params.id);
    const reduction = parseFloat(req.body.reduction);
    ordersService.applyReduction(orderId, reduction)
    .then(data => {
        res.json(data);
    })
    .catch(err => next(err));
}

function cancelReduction(req, res, next) {
    const orderId = parseInt(req.params.id);
    ordersService.cancelReduction(orderId)
    .then(data => {
        res.json(data);
    })
    .catch(err => next(err));
}

function updateAgent(req, res, next) {
    const agentId = req.body.agentId;
    const orderId = parseInt(req.params.id);
    ordersService.updateAgent(orderId, agentId)
    .then(data => {
        res.json(data);
    })
    .catch(err => next(err));
}
