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
  bcrypt.compare(password, this.password, callback);
};

// before the user password store into database, we need crypt the password
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  if(!user.isModified('password')) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }
    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(saltError);
      }
      user.password = hash;
      return next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema)
