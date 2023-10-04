const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');

const router = express.Router();

// create New Product 
router.route('/')
    .post(auth() ,validate(productValidation.createProduct),productController.create)

// update New Product 
router.route('/:id')
    .patch(auth(),validate(productValidation.updateProduct),productController.update)

// get list of all products
router.get("/getAllProducts", auth(), productController.getAll)

//get & delete single product by product Id
router.route('/:productId')
    .get(auth(),productController.getById)
    .delete(auth(),productController.deleteById)


module.exports = router