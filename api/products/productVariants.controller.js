const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const productVariantService = require('./productVariants.service');

// public routes
router.get('/product/:id', getByProductId);
router.get('/:id', getById);
//admin routes
router.post('/', create);
router.delete('/:id', deleteById);
router.put('/:id', updateById);
router.delete('/product/:id', deleteByProductId);
// all authenticated users routes

// user only routes

module.exports = router;

function create(req, res, next) {
    productVariantService.create(req.body)
        .then((pVariant) => {
            res.json(pVariant);
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    productVariantService.getById(id)
        .then((pVariant) => {
            res.json(pVariant);
        })
        .catch(err => next(err));
}

function deleteById(req, res, next) {
    const id = parseInt(req.params.id);
    productVariantService.deleteById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    productVariantService.updateById(id, req.body)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => next(err));
}

function getByProductId(req, res, next) {
    const id = parseInt(req.params.id);
    productVariantService.getByProductId(id)
        .then((pVariants) => {
            res.json(pVariants);
        })
        .catch(err => next(err));
}

function deleteByProductId(req, res, next) {
    const id = parseInt(req.params.id);
    productVariantService.deleteByProductId(id)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}


