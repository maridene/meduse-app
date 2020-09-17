const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const manufacturerService = require('./manufacturers.service');

// public routes
router.get('/', getAll);
router.get('/:id', findById);


//admin routes
router.post('/', create);
router.delete('/:id', remove);
router.put('/:id', updateById);

// all authenticated users routes

// user only routes

module.exports = router;

function getAll(req, res, next) {
    manufacturerService.getAll()
        .then((manufacturers) => {
            res.json(manufacturers);
        })
        .catch(err => next(err));
}

function findById(req, res, next) {
    const id = parseInt(req.params.id);
    manufacturerService.findById(id)
        .then((manufacturer) => {
            res.json(manufacturer);
        })
        .catch(err => next(err));
}

function create(req, res, next) {
    const manufacturer = req.body;
    manufacturerService.create(manufacturer)
    .then((response) => {
        res.json(response);
    })
    .catch(err => next(err));
}

function remove(req, res, next) {
    const id = parseInt(req.params.id);
    manufacturerService.remove(id)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    manufacturerService.updateById(id, req.body)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}
