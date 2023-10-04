const Joi = require('joi');

const createProduct = {
    body: Joi.object().keys({
        "category": Joi.string().required(),
        "name": Joi.string().required(),
        "description": Joi.string().required(),
        "sku": Joi.string().required(),
        "barcode": Joi.string().required(),
        "brand": Joi.string().required().allow(null),
        // "brand": Joi.string().required().allow(null),
        "stock": Joi.number().required(),
        "cost": Joi.number().optional(),
        "taxPercent": Joi.number().required(),
        "basePrice": Joi.number().optional(),
        "price": Joi.number().required(),
        "active": Joi.boolean().required(),
        "userId": Joi.string().required(),
        "socketId": Joi.string().required()
    }),
};



module.exports = {
    createProduct
};
