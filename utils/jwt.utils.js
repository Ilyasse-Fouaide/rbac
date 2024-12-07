const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');
const setCookie = require('./setCookie');
const Error = require('../custom-error');

function verifyJwtToken(token, secretKey, cb) {
  jwt.verify(token, secretKey, (err, decoded) => {
    cb(err, decoded);
  });
}

async function registerJwtRefreshToken(user, req, res, next) {
  const refreshToken = user.genRefreshToken();
  const accessToken = user.genAccessToken();

  // save the refresh token in the database
  const userToken = {
    refreshToken,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    user: user._id
  };

  const token = await Token.findOneAndUpdate(
    { user: user._id },
    userToken,
    { upsert: true, new: true }
  );

  if (!token.isValid) {
    return next(Error.unAuthorized());
  }

  setCookie(res, refreshToken);
  return { refreshToken, accessToken };
}

module.exports = { verifyJwtToken, registerJwtRefreshToken };
