const express = require('express');
const path = require("path");
const router = express.Router();
const ordersStatsService = require('./ordersStats.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');

router.get('/done/month/:yearMonth', authorize(Role.Admin), getDoneOrdersByMonth);
router.get('/created/month/:yearMonth', authorize(Role.Admin), getCreatedOrdersByMonth);
router.get('/orders/month/:yearMonth', authorize(Role.Admin), getAllOrdersByMonth);

module.exports = router;

function getDoneOrdersByMonth(req, res, next) {
    const yearMonth = req.params.yearMonth;
    ordersStatsService.findDoneAndPaidByMonth(yearMonth)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}

function getCreatedOrdersByMonth(req, res, next) {
    const yearMonth = req.params.yearMonth;
    ordersStatsService.findCreatedOrdersByMonth(yearMonth)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}

function getAllOrdersByMonth(req, res, next) {
    const yearMonth = req.params.yearMonth;
    ordersStatsService.findAllOrdersByMonth(yearMonth)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}
