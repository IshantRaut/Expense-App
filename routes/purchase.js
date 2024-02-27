const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchase');
const authenticationMiddleware = require('../middleware/auth');

router.get('/createorder',authenticationMiddleware.authenticate,purchaseController.createOrder);
router.post('/checkout',authenticationMiddleware.authenticate,purchaseController.checkOut);

module.exports= router;