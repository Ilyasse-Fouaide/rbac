const { Token } = require('../models');
const setCookie = require('../utils/setCookie');
const JWT = require('./jwt');
const Error = require('../custom-error');

const registerJwtTokens = async (user, req, res, next) => {
  const jwt = new JWT();

  const tokens = jwt.generateTokens(user);

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

  if (!tokenUser.isValid) {
    return next(Error.unAuthorized());
  }

  await tokenUser.save();

  setCookie(res, 'refreshToken', tokens.refreshToken, jwt.accessTokenExpiresMs);

  return tokens;
};

module.exports = registerJwtTokens;
