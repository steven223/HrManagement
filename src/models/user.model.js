const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = new mongoose.Schema({
  type: String,
  products : {},
  amount: Number,
  // You can add more fields like timestamps, product details, etc. as needed
}, {
  toJSON: { virtuals: true },
  timestamps: true,
});


const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    profileImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    registerAs: {
      type: String,
      enum: ['Employee','Employer'],
      default: 'admin',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      required: false,
      trim: true,
      minlength: 10
    },
    transactions : [transactionSchema]
    // addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }]

  }, {
  toJSON: { virtuals: true },
  timestamps: true,
}
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'userId',
  justOne: false // set true for one-to-one relationship
})

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
