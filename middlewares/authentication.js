const jwt = require('jsonwebtoken');
const Error = require('../custom-error');
const config = require('../config');

const authenticated = (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(Error.unAuthorized());
  }

  jwt.verify(refresh_token, config.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return next(Error.unAuthorized());

    const user = {
      userId: decoded.userId,
      email: decoded.email,
    }

    req.user = user;
    next();
  });
}

module.exports = authenticated;