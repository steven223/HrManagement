const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const walletService = require('../services/wallet.service');
const { User, Address } = require('../models');
const { getIo } = require('../socket');
const { getUserById } = require('../services/user.service');
const { getByBarcode } = require('../services/product.service');


const getbalance = catchAsync(async (req, res) => {
    console.log(req.body)
    const { userId } = req.params;
    const user = await getUserById(userId)
    res.sendResponse({ balance: user.balance }, httpStatus.OK);
});

const topup = catchAsync(async (req, res) => {
    console.log(req.body)
    const { userId, amount } = req.body;
    const user = await getUserById(userId)
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (!user.balance) user.balance = 0;
    user.balance += amount;
    user.transactions.push({ type: 'topup', amount: amount });
    await user.save();
    res.sendResponse({ amount: user.balance }, "Top Up Successfull", httpStatus.OK);
});

const purchase = catchAsync(async (req, res) => {
    const { userId, barcode, quantity } = req.body;
    const user = await getUserById(userId)
    const product = await getByBarcode(barcode)
    console.log(user.balance, product)
    var totalPrice = (product.price + (product.price * product.taxPercent)/100 )* quantity
    if (user.balance < totalPrice) {
        throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'insufficient balance')
    }
    console.log("totalPrice,", product.price, user.balance, totalPrice)
    user.balance = user.balance - totalPrice;
    let products = {
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        brand: product.brand,
        description: product.description,
        category: product.category,
        taxPercent: product.taxPercent,
        basePrice: product.basePrice,
        price: product.price,
        quantity: quantity,
    }
    user.transactions.push({ type: 'purchase', products, amount: totalPrice });
    await user.save();
    res.status(200).json({ message: 'Purchase successful', balance: user.balance });
})

const getAll = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await getUserById(userId)
    // const transactions = user.transactions || [];
    const user2 = await User.findById(userId)
        .populate({ path: 'transactions', options: { sort: { createdAt: 1 } } })
        
    res.sendResponse(user2.transactions.reverse(), "Fetched Successfully", httpStatus.OK);
})



module.exports = {
    topup,
    getAll,
    purchase,
    getbalance
}