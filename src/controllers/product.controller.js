const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');
const { getIo } = require('../socket');
const redisModule = require('../utils/redis'); // Adjust the path as needed


const create = catchAsync(async (req, res) => {
    const { socketId, userId } = req.body;
    // const { userId } = req.params
    delete req.body.socketId;
    const result = await productService.create(userId, req.body);
    const io = getIo();

    const my_socket = io.sockets.sockets.get(socketId);
    // console.log(my_socket)
    if (my_socket) {
        my_socket.broadcast.emit('newProductAdded', 'nice game testing')
        // my_socket.broadcast.to(userId).emit('newProductAdded', 'nice game');
    }


    // Publish the event to the Redis channel
    // redisModule.publishProductEvent(newProduct);

    res.sendResponse(result, "Created", httpStatus.CREATED);
})
const update = catchAsync(async (req, res) => {
    const result = await productService.update(req.params.id, req.body);
    res.sendResponse(result, "Updated", httpStatus.OK);
})

const getAll = catchAsync(async (req, res) => {
    // let filter = { userId: req.params.userId }
    let options = {
        sortBy: req.query.sortBy, // sort order
        limit: req.query.limit, // maximum results per page
        page: req.query.page, // page number
        searchQuery: req.query.search, // search query
    };

    let query = {};

    // If a search query is provided, construct the search condition
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query = {
            $or: [
                { name: { $regex: searchRegex } },
                { barcode: { $regex: searchRegex } }
            ]
        };
    }
    

    const result = await productService.getAll(query, options);
    res.sendResponse(result, "Fetched Successfully", httpStatus.OK);
})
const getById = catchAsync(async (req, res) => {
    const result = await productService.getById(req.params.productId);
    res.sendResponse(result, "Fetched Successfully", httpStatus.OK);
})
const deleteById = catchAsync(async (req, res) => {
    const result = await productService.deleteById(req.params.productId);
    res.sendResponse(result, "Deleted Successfully", httpStatus.OK);
})


module.exports = {
    create,
    getAll,
    getById,
    deleteById,
    update
}