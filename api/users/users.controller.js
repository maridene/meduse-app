const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');
const utils = require('utils');

// public routes
router.post('/authenticate', authenticate);
router.post('/register',  register);

//admin routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/clients', authorize(Role.Admin), getClients);
router.get('/admins', authorize(Role.Admin), getAdmins);
router.delete('/:id', authorize(Role.Admin), deleteUser);
router.post('/register-admin', authorize(Role.Admin), addAdmin);

// all authenticated users routes
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), update);

module.exports = router;

function authenticate(req, res, next) {
    if (utils.isEmptyCredentials(req.body)) {
        res.status(400).json({ message: 'empty credentials' });
    }
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'email or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getClients(req, res, next) {
    userService.getClients()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAdmins(req, res, next) {
    userService.getAdmins()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function register(req, res, next) {
    if (!utils.formValid.user(req.body)) {
        res.status(400).json({message : 'form not valid'});
    } else {
        userService.create(req.body, Role.User)
        .then(user => user ? res.json(user) : res.status(400).json({message : 'error occured while creating user'}))
        .catch(err => next(err));
    }
}

function addAdmin(req, res, next) {
    if (!utils.formValid.admin(req.body)) {
        res.status(400).json({message : 'form not valid'});
    }
    userService.create(req.body, Role.Admin)
        .then(user => user ? res.json(user) : res.status(400).json({message : 'error occured while creating user'}))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    if (utils.isNormalInteger(req.params.id)) {
        const id = parseInt(req.params.id);
        userService.deleteUser(id)
            .then(() => res.status(200).json({message: 'user deleted succesfully'}))
            .catch((err) => next(err));
    } else {
        res.status(400).json({kind: 'invalid_params', messsage: 'expected id as a number'});
    }
}

function update(req, res, next) {
    userService.update(req.body)
        .then((user) => user ? res.json(user) : res.sendStatus)
}
