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


//admin routes
router.post('/', authorize(Role.Admin), create);
router.delete('/:id', authorize(Role.Admin),deleteById);
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
