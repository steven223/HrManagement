const express = require('express');
const router = express.Router();

//routes import
const authRoute = require('./auth.route');
const productRoute = require('./product.route');

const walletRoute = require('./wallet.route');

router.use('/auth',authRoute)

router.use('/product',productRoute)

router.use('/wallet',walletRoute)

module.exports = router;
