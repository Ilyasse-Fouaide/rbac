const jwt = require('jsonwebtoken');
const Token = require('../models/token.model');
const setCookie = require('./setCookie');
const Error = require('../custom-error');
const config = require('../config');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

function createTokenUser(user) {
  return { userId: user._id, email: user.email };
}

function createJWT(payload, secretKey, expiresIn) {
  return jwt.sign(payload, secretKey, { expiresIn });
}

function verifyJwtToken(token, secretKey) {
  return jwt.verify(token, secretKey);
}

function attachCookiesToResponse(res, user, refreshToken) {
  const accessTokenJwt = createJWT(
    { user },
    config.JWT_ACCESSTOKEN_SECRET_KEY,
    config.JWT_ACCESSTOKEN_LIFETIME,
  );
  const refreshTokenJwt = createJWT(
    { user, refreshToken },
    config.JWT_REFRESHTOKEN_SECRET_KEY,
    config.JWT_REFRESHTOKEN_LIFETIME,
  );

  const accessTokenExpires = 1000 * 60 * 15; // 15min
  const refreshTokenExpires = 1000 * 60 * 60 * 24 * 7; // 7day

  setCookie(res, 'access_token', accessTokenJwt, accessTokenExpires);
  setCookie(res, 'refresh_token', refreshTokenJwt, refreshTokenExpires);
}

async function registerJwtTokens(user, req, res, next) {
  const userPayload = createTokenUser(user);

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    if (!existingToken.isValid) {
      return next(Error.badRequest('Invalid Credentials'));
    }
    const existingRefreshToken = existingToken.refreshToken;
    attachCookiesToResponse(res, userPayload, existingRefreshToken);
    return res.status(StatusCodes.OK).json({});
  }

  const refreshToken = crypto.randomBytes(48).toString('hex');

  const userToken = {
    refreshToken,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    user: user._id,
  };

  await Token.create(userToken);

  attachCookiesToResponse(res, userPayload, refreshToken);
}

module.exports = {
  createTokenUser,
  verifyJwtToken,
  attachCookiesToResponse,
  registerJwtTokens,
};
