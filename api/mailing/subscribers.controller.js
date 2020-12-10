const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const subscriberService = require('./subscriber.service');
const Role = require('helpers/role');
const utils = require('utils');

// admin routes
router.get('/', authorize(Role.Admin), getAll);
router.delete('/:param', authorize(Role.Admin), remove);

//public routes
router.post('/' ,subscribe);

function getAll(req, res, next) {
    subscriberService.getAll()
        .then((emails) => {
            res.json(emails);
        })
        .catch(err => next(err));
}

function remove(req, res, next) {
    const param = req.params.param;
    if (utils.isNormalInteger(param)) {
        const id = parseInt(param);
        subscriberService.removeById(id)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
    } else {
        subscriberService.removeByEmail(param)
        .then((response) => {
            res.json(response);
        })
        .catch(err => next(err));
    }
    
}

function subscribe(req, res, next) {
    const email = req.body.email;
    subscriberService.subscribe(email)
    .then((response) => {
        res.json(response);
    })
    .catch(err => next(err));
}

module.exports = router;
