const express = require('express');
const router = express.Router();
const users = require('../middleware/create-users');

const authController = require('../controllers/auth');

router.post('/login', users, authController.postLogin);

router.post('/product', authController.addProduct);

router.get('/product/size', authController.getTotalProducts);

router.get('/product', authController.getProducts);

module.exports = router;