const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const assetsService = require('./assets.service');

// public routes
router.get('/:id', findById);
router.get('/reference/:ref',  getByProductRef);
router.post('/', add);

module.exports = router;

function findById(req, res, next) {
    const id = parseInt(req.params.id);
    assetsService.findById(id)
        .then((asset) => {
            res.json(asset);
        })
        .catch(err => next(err));
}

function getByProductRef(req, res, next) {
    const ref = req.params.ref;
    assetsService.getByProductRef(ref)
        .then((asset) => {
            res.json(asset);
        })
        .catch(err => next(err));
}

function add(req, res, next) {
    assetsService.add(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message : 'error occured while creating asset'}))
        .catch(err => next(err));
}

