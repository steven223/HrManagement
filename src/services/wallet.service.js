const httpStatus = require('http-status');
const logger = require('../config/logger');
const { Wallet } = require('../models');
const ApiError = require('../utils/ApiError');


const getAll = async (filter, options) => {
    return await Wallet.paginate(filter, options)
};



module.exports = {

    getAll,

};
