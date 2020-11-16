const express = require('express');
const router = express.Router();
const settingsService = require('./settings.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');


router.get('/:label', getByLabel);
router.get('/type/:type', getByType);

router.get('/', authorize(Role.Admin), getAll);
router.put('/:label', authorize(Role.Admin), updateByLabel);

module.exports = router;

function getByLabel(req, res, next) {
    const label = req.params.label;
    settingsService.getByLabel(label)
        .then(entry => res.json(entry))
        .catch(err => next(err));
}

function getByType(req, res, next) {
    const type = req.params.type;
    settingsService.getByType(type)
        .then(entries => res.json(entries))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    settingsService.getAll()
        .then(entries => res.json(entries))
        .catch(err => next(err));
}

function updateByLabel(req, res, next) {
    const label = req.params.label;
    const value = req.body.value;
    settingsService.updateByLabel(label, value)
        .then(result => res.json(result))
        .catch(err => next(err));
}
