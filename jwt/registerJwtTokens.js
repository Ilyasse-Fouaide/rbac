const { Token } = require('../models');
const setCookie = require('../utils/setCookie');
const JWT = require('./jwt');
const Error = require('../custom-error');

const registerJwtTokens = async (user, req, res, next) => {
  const jwt = new JWT();

  // generate both refreshToken and accessToken
  const tokens = jwt.generateTokens(user);

  // save the refreshToken in db without duplicating
  const tokenUser = await Token.findOneAndUpdate(
    {
      user: user._id,
    },
    {
      refreshToken: tokens.refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      user: user._id,
    },
    { new: true, upsert: true },
  );

  // unAuthorized access for banned users
  if (!tokenUser.isValid) {
    return next(Error.unAuthorized());
  }

  // save token user
  await tokenUser.save();

  // store only refreshToken to cookie
  setCookie(
    res,
    'refreshToken',
    tokens.refreshToken,
    jwt.refreshTokenExpiresMs,
  );

  // return both tokens
  return tokens;
};

module.exports = registerJwtTokens;
