const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const productService = require('./products.service');

// public routes
router.get('/', getAll);
router.get('/:id', findById);
router.get('/category/:categoryId',  findByCategory);
router.get('/reference/:ref', findByReference);


//admin routes

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
    productService.findByCategory(req.params.categoryId)
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

