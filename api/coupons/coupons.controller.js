const express = require('express');
const router = express.Router();
const couponsService = require('./coupons.service');
const authorize = require('helpers/authorize')
const Role = require('helpers/role');


router.get('/mycoupons', authorize(Role.User), getMyCoupons);
router.post('/check', authorize(Role.User), checkCoupon);
router.get('/getacoupon', authorize(Role.User), getAcoupon)
router.get('/:id', authorize(Role.Admin), getById);
module.exports = router;

function getMyCoupons(req, res, next) {
    const userId = parseInt(req.header('userId'));
    couponsService.getMyCoupons(userId)
        .then(coupons => res.json(coupons))
        .catch(err => next(err));
}

function checkCoupon(req, res, next) {
    const couponCode = req.body.code;
    couponsService.checkCoupon(couponCode)
        .then(coupon => res.json(coupon))
        .catch(err => next(err));
}

function getAcoupon(req, res, next) {
    const userId = parseInt(req.header('userId'));
    couponsService.getAcoupon(userId)
        .then(coupon => res.json(coupon))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    couponsService.getById(id)
        .then(coupon => res.json(coupon))
        .catch(err => next(err));
}
