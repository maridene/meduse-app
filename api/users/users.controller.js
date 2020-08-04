const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

// public routes
router.post('/authenticate', authenticate);
router.post('/register',  create);

//admin routes
router.get('/', authorize(Role.Admin), getAll);
router.delete('/:id', authorize(Role.Admin), deleteUser);

// all authenticated users routes
router.get('/:id', authorize(), getById);

// user only routes
router.put('/:id', authorize(Role.User), update);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'email or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
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

function create(req, res, next) {
    userService.create(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message : 'error occured while creating user'}))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    userService.delete(req.body)
    .then(() => res.status(200).json({message: 'user deleted succesfully'}))
    .catch((err) => next(err));
}

function update(req, res, next) {
    userService.update(req.body)
        .then((user) => user ? res.json(user) : res.sendStatus)
}
