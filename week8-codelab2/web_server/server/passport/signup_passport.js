const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config/config.json');

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true // should be set to true, otherwise may not work
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password
  };

  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
});
