const express = require('express');
const router = express.Router();
const addressService = require('./addresses.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

//public routes

//admin routes
router.get('/user/:id', authorize(Role.Admin), getUserAddresses);

//all authenticated users routes

//user only routes
router.get('/myaddresses', authorize(Role.User), getByUserId);
router.get('/:id', authorize(Role.User), getByIdAndUserId);
router.put('/:id', authorize(Role.User), update);
router.delete('/:id', authorize(Role.User), remove);
router.post('/', authorize(Role.User), create);


module.exports = router;

function getByIdAndUserId(req, res, next) {
    const userId = parseInt(req.header('userId'));
    const id = parseInt(req.params.id);

    addressService.getByIdAndUserId(userId, id)
        .then((result) => res.json(result))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    const userId = req.header('userId');
    addressService.getByUserId(userId)
        .then((result) => res.json(result))
        .catch(err => next(err));
}

function update(req, res, next) {
    const id = parseInt(req.params.id);
    const address = req.body;
    addressService.updateById(id, address)
        .then((result) => res.json(result))
        .catch(err => next(err));
}

function remove(req, res, next) {
    const userId = parseInt(req.header('userId'));
    const addressId = parseInt(req.params.id);
    addressService.remove(userId, addressId)
        .then(address => address ? res.json(address) : res.status(400).json({message: 'error occured while adding address'}))
        .catch(err => next(err));
}

function create(req, res, next) {
    const userId = parseInt(req.header('userId'));
    const address = Object.assign({}, req.body, {userId});
    addressService.add(address)
        .then(address => address ? res.json(address) : res.status(400).json({message: 'error occured while adding address'}))
        .catch(err => next(err));
}

function getUserAddresses(req, res, next) {
    const userId = req.params.id;
    addressService.getByUserId(userId)
        .then((result) => res.json(result))
        .catch(err => next(err));
}
