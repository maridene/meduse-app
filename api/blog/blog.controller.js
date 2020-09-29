const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const blogService = require('./blog.service');
const Role = require('helpers/role');

// public routes
router.get('/', getAll);
router.get('/:id', findById);


//admin routes
router.post('/', authorize(Role.Admin), create);
router.delete('/:id', authorize(Role.Admin), remove);
router.put('/:id', authorize(Role.Admin), updateById);

// all authenticated users routes

// user only routes

module.exports = router;

function getAll(req, res, next) {
    blogService.getAll()
        .then((categories) => {
            res.json(categories);
        })
        .catch(err => next(err));
}

function findById(req, res, next) {
    const id = parseInt(req.params.id);
    blogService.findById(id)
        .then((categories) => {
            res.json(categories);
        })
        .catch(err => next(err));
}

function create(req, res, next) {
    const blog = req.body;
    blogService.create(blog)
    .then((response) => {
        res.json(response);
    })
    .catch(err => next(err));
}

function remove(req, res, next) {
    const id = parseInt(req.params.id);
    blogService.remove(id)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = parseInt(req.params.id);
    blogService.updateById(id, req.body)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
}
