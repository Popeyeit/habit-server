const mongoose = require('mongoose');
const { Schema } = mongoose;
const { updateUserToken, getUserByEmail } = require('./services');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  nickName: {
    type: String,
    required: true,
    min: 6,
  },
  //   subscription: {
  //     type: String,
  //     enum: ['free', 'pro', 'premium'],
  //     default: 'free',
  //   },
  token: {
    type: String,
    required: false,
    default: null,
  },
  avatarURL: {
    type: String,
    required: false,
  },
  verificationToken: {
    type: String,
    required: false,
  },
});

userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserToken = updateUserToken;

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
