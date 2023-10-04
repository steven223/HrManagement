

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const WalletSchema = mongoose.Schema({
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
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
},
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
WalletSchema.plugin(toJSON);
WalletSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
