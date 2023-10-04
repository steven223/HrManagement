const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const walletController = require('../controllers/wallet.controller');

const router = express.Router();


// create topup
router.route('/topup')
    .post(auth(), walletController.topup)

// update New Product 
router.route('/purchase')
    .post(auth(), walletController.purchase)

// get list of all products
router.get("/getAllTransactions/:userId", auth(), walletController.getAll)

// balance
router.get('/getBalance/:userId',auth(), walletController.getbalance)


module.exports = router