const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const productService = require('./products.service');
const Role = require('helpers/role');

// public routes
router.get('/', getAll);
router.get('/:id', findById);
router.get('/category/:categoryId',  findByCategory);
router.get('/reference/:ref', findByReference);
router.get('/last/:n', lastNProducts);
router.get('/pin/pinned', getPinnedProducts);
router.get('/related/:id', getRelatedProducts);


//admin routes
router.post('/', authorize(Role.Admin), create);
router.delete('/:id', authorize(Role.Admin),deleteById);
router.put('/:id', authorize(Role.Admin), updateById);
router.post('/pin/:id', authorize(Role.Admin), updatePinState);
// all authenticated users routes

// user only routes

module.exports = router;

function getAll(req, res, next) {
    productService.getAll()
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function lastNProducts(req, res, next) {
    const n = parseInt(req.params.n);
    if (n === NaN) {
        next({message: 'Not a number'});
    } else {
        productService.lastNProducts(n)
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
    }
}

function findById(req, res, next) {
    const id = parseInt(req.params.id);
    productService.findById(id)
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function findByCategory(req, res, next) {
    const startAt = req.query.startat;
    const maxResult = req.query.maxresult;
    const orderBy = req.query.orderBy || 'default';
    productService.findByCategory(req.params.categoryId, startAt, maxResult, orderBy)
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function findByReference(req, res, next) {
    const ref = req.params.ref;
    productService.findByReference(ref)
        .then((product) => {
            res.json(product);
        })
        .catch(err => next(err));
}

function create (req, res, next) {
    productService.create(req.body)
        .then((product) => {
            res.json(product);
        })
        .catch(err => next(err));
}

function deleteById(req, res, next) {
    const id = req.params.id;
    productService.deleteById(id)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = req.params.id;
    const product = req.body;
    productService.updateById(id, product)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updatePinState(req, res, next) {
    const id = req.params.id;
    const newState = parseInt(req.body.state);
    productService.updatePinState(id, newState)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function getPinnedProducts(req, res, next) {
    productService.getPinnedProducts()
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function getRelatedProducts(req, res, next) {
    const id = parseInt(req.params.id);
    productService.getRelatedProducts(id)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

