

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ProductSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    vendor: {
        type: String,
        required: false,
    },
    stock: {
        type: Number,
        required: true,
    },
    reserved: {
        type: Number,
    },
    cost: {
        type: Number,
        required: true,
    },
    basePrice: {
        type: Number,
        required: false,
    },
    taxPercent: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
    },
    thumbnail: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        required: true,
    },
    productImages: [
        {
            name: String,
            link: String
        }
    ],
    // userId: {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
},
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
ProductSchema.plugin(toJSON);
ProductSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
