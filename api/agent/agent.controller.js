const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const agentService = require('./agent.service');
const Role = require('helpers/role');

//admin routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(Role.Admin), getById);
router.post('/', authorize(Role.Admin), create);
router.delete('/:id', authorize(Role.Admin), remove);
router.put('/:id', authorize(Role.Admin), updateById);

module.exports = router;

function getAll(req, res, next) {
    agentService.getAll()
        .then((agents) => {
            res.json(agents);
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    agentService.getBy(id)
        .then((agent) => {
            res.json(agent);
        })
        .catch(err => next(err));
}

function create(req, res, next) {
    const name = req.body.name;
    agentService.create(name)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));

}

function remove(req, res, next) {
    const id = parseInt(req.params.id)
    agentService.remove(id)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const name = req.body.name;
    const id = parseInt(req.params.id);
    agentService.updateById(id, name)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}
