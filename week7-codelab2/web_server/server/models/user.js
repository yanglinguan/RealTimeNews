const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {

}
