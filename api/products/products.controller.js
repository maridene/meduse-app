const express = require('express');
const router = express.Router();
const authorize = require('helpers/authorize');
const productService = require('./products.service');
const Role = require('helpers/role');

// public routes
router.get('/', getAll);
router.get('/:id', findById);
router.get('/category/:categoryId',  findByCategory);
router.get('/reference/:ref', findByReference);
router.get('/last/:n', lastNProducts);
router.get('/pin/pinned', getPinnedProducts);
router.get('/new/isnew', getNewProducts);
router.get('/promo/all', getPromoProducts);
router.get('/related/:id', getRelatedProducts);
router.get('/all/search', search);

//admin routes

router.get('/getbyid/:id', authorize(Role.Admin), getById);
router.get('/getbycategory/:categoryId', authorize(Role.Admin), getByCategory);
router.post('/', authorize(Role.Admin), create);
router.post('/updateorders', authorize(Role.Admin), updateOrders);
router.delete('/:id', authorize(Role.Admin),deleteById);
router.put('/:id', authorize(Role.Admin), updateById);
router.post('/pin/:id', authorize(Role.Admin), updatePinState);
router.post('/new/:id', authorize(Role.Admin), updateIsNew);
router.post('/exclusif/:id', authorize(Role.Admin), updateIsExclusif);
router.post('/hidden/:id', authorize(Role.Admin), updateIsHidden);

// all authenticated users routes

// user only routes

module.exports = router;

function getAll(req, res, next) {
    productService.getAll()
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

async function search(req, res, next) {
    const query = req.query.query;
    productService.search(query, await getReqParams(req))
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

async function lastNProducts(req, res, next) {
    const n = parseInt(req.params.n);
    if (n === NaN) {
        next({message: 'Not a number'});
    } else {
        productService.lastNProducts(n, await getReqParams(req))
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
    }
}

async function findById(req, res, next) {
    const id = parseInt(req.params.id);
    productService.findById(id, await getReqParams(req))
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);
    productService.getByIdWithVariants(id)
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

async function findByCategory(req, res, next) {
    productService.findByCategory(req.params.categoryId, await getReqParams(req))
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function getByCategory(req, res, next) {
    productService.getByCategory(req.params.categoryId)
        .then((products) => {
            res.json(products);
        })
        .catch(err => next(err));
}

function findByReference(req, res, next) {
    const ref = req.params.ref;
    productService.findByReference(ref)
        .then((product) => {
            res.json(product);
        })
        .catch(err => next(err));
}

function create (req, res, next) {
    productService.create(req.body)
        .then((product) => {
            res.json(product);
        })
        .catch(err => next(err));
}

function deleteById(req, res, next) {
    const id = req.params.id;
    productService.deleteById(id)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateById(req, res, next) {
    const id = req.params.id;
    const product = req.body;
    productService.updateById(id, product)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updatePinState(req, res, next) {
    const id = req.params.id;
    const newState = parseInt(req.body.state);
    productService.updatePinState(id, newState)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateIsNew(req, res, next) {
    const id = req.params.id;
    const value = parseInt(req.body.value);
    productService.updateIsNew(id, value)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateIsExclusif(req, res, next) {
    const id = req.params.id;
    const value = parseInt(req.body.value);
    productService.updateIsExclusif(id, value)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateIsHidden(req, res, next) {
    const id = req.params.id;
    const value = parseInt(req.body.value);
    productService.updateIsHidden(id, value)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

async function getPinnedProducts(req, res, next) {
    productService.getPinnedProducts(await getReqParams(req))
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

async function getNewProducts(req, res, next) {
    productService.getNewProducts(await getReqParams(req))
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

async function getPromoProducts(req, res, next) {
    productService.getPromoProducts(await getReqParams(req))
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

async function getRelatedProducts(req, res, next) {
    const id = parseInt(req.params.id);
    productService.getRelatedProducts(id, await getReqParams(req))
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

function updateOrders(req, res, next) {
    const data = req.body;
    productService.updateOrders(data)
        .then((result) => {
            res.json(result);
        })
        .catch(err => next(err));
}

async function getReqParams(req) {
    const params = {};
    const userId = req.headers["userId"];
    if (userId) {
        const user = await userService.getById(userId);
        if (user.premium === '1') {
            params.premium = true;
        }
    }
    return params;
}
