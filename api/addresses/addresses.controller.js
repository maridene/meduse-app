const express = require('express');
const router = express.Router();
const addressService = require('./addresses.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

//public routes

//admin routes

//all authenticated users routes

//user only routes
router.get('/myaddresses', getByUserId);
router.put('/:id', authorize(Role.User), update);
router.delete('/:id', authorize(Role.User), remove);
router.post('/', authorize(Role.User), create);


module.exports = router;

function getByUserId(req, res, next) {
    const userId = req.header('userid');
    addressService.getByUserId(userId)
        .then((result) => res.json(result))
        .catch(err => next(err));
}

function update(req, res, next) {

}

function remove(req, res, next) {

}

function create(req, res, next) {
    addressService.add(req.body)
        .then(address => address ? res.json(address) : res.status(400).json({message: 'error occured while adding address'}))
        .catch(err => next(err));
    }