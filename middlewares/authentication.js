const Error = require('../custom-error');
const config = require('../config');
const {verifyJwtToken} = require('../utils/jwt.utils');

const authenticated = (req, res, next) => {
  const tokenAuthHeader = req.headers.authorization;

  if (!tokenAuthHeader) {
    return next(Error.unAuthorized());
  }

  const token = tokenAuthHeader.split(' ')[1];

  verifyJwtToken(token, config.JWT_ACCESSTOKEN_SECRET_KEY, (err, decoded) => {
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