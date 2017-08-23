const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config/config.json');

module.exports = (req, res, next) => {
  console.log('auth_checker: req: ' + req.headers);

  if (!req.headers.authorization) {
    // if the header does not contain authorization header,
    // return unauthorized error (401)
    return res.status(401).end();
  }

  // authorization header: "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  console.log('auth_checker: token: ' + token);

  // decode the token using a secret key
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      // if token is invalid, then return error
      return res.status(401).end()
    }
    // when decoded, check if user exists
    const email = decoded.sub;

    return User.findById(email, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }
      // if everything is ok, then pass to next function
      return next();
    })
  })
}
