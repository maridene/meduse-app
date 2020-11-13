const express = require('express');
const router = express.Router();
const orderRowsService = require('./orderRows.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

/**
 * Order states:
 *  - new : Nouvelle
 *  - confirmed : confirmée
 *  - in progress : en cours de traitement
 *  - shipping: en livraison
 *  - shipped: livrée
 *  - done : livré et payé
 *  - canceled: annulée
*/

// public routes

//admin routes

router.get('/:id', authorize(Role.Admin), getById);
router.get('/order/:id', authorize(Role.Admin), getByOrderId);
router.get('/product/:id', authorize(Role.Admin), getByProductId);
router.post('/', authorize(Role.Admin), createOrderRow);
router.put('/:id', authorize(Role.Admin), updateById);
router.delete('/:id', authorize(Role.Admin), removeById);
router.put('/:id/quantity', authorize(Role.Admin), updateQuantityById);

// all authenticated users routes

module.exports = router;

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    orderRowsService.getById(id)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function getByOrderId(req, res, next) {
    const id = parseInt(req.params.id);
    orderRowsService.getByOrderId(id)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function getByProductId(req, res, next) {
    const id = parseInt(req.params.id);
    orderRowsService.getByProductId(id)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function createOrderRow(req, res, next) {
    const orderRow = req.body;
    orderRowsService.add(orderRow)
        .then(order => order ? res.json(order) : res.status(400).json({message : 'error occured while creating order row'}))
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    const newOrderRow = req.body;
    orderRowsService.updateById(id, newOrderRow)
        .then(order => res.json(order))
        .catch(err => next(err));
}

function removeById(req, res, next) {
    const id = parseInt(req.params.id);
    orderRowsService.removeById(id)
        .then(result => res.json(result))
        .catch(err => next(err));
}

function updateQuantityById(req, res, next) {
    const id = parseInt(req.params.id);
    const newQty = req.body.newQty;
    orderRowsService.updateQuantityById(id, newQty)
        .then(result => res.json(result))
        .catch(err => next(err));
}
