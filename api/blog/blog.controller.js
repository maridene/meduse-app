const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const categoryService = require('./blog.service');

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
    categoryService.getAll()
        .then((categories) => {
            res.json(categories);
        })
        .catch(err => next(err));
}

function findById(req, res, next) {
    const id = parseInt(req.params.id);
    categoryService.findById(id)
        .then((categories) => {
            res.json(categories);
        })
        .catch(err => next(err));
}

function create(req, res, next) {
    const category = req.body;
    categoryService.create(category)
    .then((response) => {
        res.json(response);
    })
    .catch(err => next(err));
}

function remove(req, res, next) {
    const id = parseInt(req.params.id);
    categoryService.remove(id)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    categoryService.updateById(id, req.body)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}
