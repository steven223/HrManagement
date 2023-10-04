const httpStatus = require('http-status');
const logger = require('../config/logger');
const { User, Address } = require('../models');
const ApiError = require('../utils/ApiError');


const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  const newUser = new User({
    ...userBody
  });
  return await newUser.save();
};


const getUserById = async (id) => {
  let user = await User.findById(id)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND,`User ${id} does not exist)`);
  return user
};

const getUserByEmail = async (email) => {
  let a = await User.findOne({ email });
  return a
};


const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};


module.exports = {
  createUser,
  getUserById,
  getUserByEmail,

};
