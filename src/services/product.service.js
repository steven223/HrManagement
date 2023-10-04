const httpStatus = require('http-status');
const logger = require('../config/logger');
const { User, Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} productBody
 * @returns {Promise<User>}
 */
const create = async (userId, productBody) => {
    console.log("productBody", productBody)
    let res = await Product.countDocuments({
        $or: [
            { sku: productBody.sku },
            { barcode: productBody.barcode }
        ]
    });
    console.log(res);
    if(res !=0){
        throw new ApiError(httpStatus.CONFLICT, 'product already exists with this sku or barcode');;
    }
    return await Product.create(productBody);
};

const update = async (productId, updateBody) => {
    console.log("updateBody", updateBody)
    const product = await getById(productId);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    console.log(product)
    Object.assign(product, updateBody);
    console.log(product, updateBody)
    await product.save();
    return product;
};
const getAll = async (filter, options) => {
    return await Product.paginate(filter, options)
};

const getById = async (id) => {
    return await Product.findById(id)
}

const getByBarcode = async (barcode) => {
    return await Product.findOne({
        barcode : barcode
    })
}

const deleteById = async (id) => {
    return await Product.findByIdAndDelete(id)
}



module.exports = {
    create,
    update,
    getAll,
    getById,
    deleteById,
    getByBarcode
};
