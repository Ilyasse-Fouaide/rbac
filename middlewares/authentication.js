const Error = require('../custom-error');
const config = require('../config');
const { verifyJwtToken, attachCookiesToResponse } = require('../utils/jwt.utils');
const Token = require('../models/token.model');

const authenticated = async (req, res, next) => {
  const { access_token, refresh_token } = req.cookies;

  try {
    // if there is an access_token
    if (access_token) {
      const accessTokenPayload = verifyJwtToken(access_token, config.JWT_ACCESSTOKEN_SECRET_KEY);
      // create a user object that has the access token payload
      req.user = accessTokenPayload.user
      return next();
    }

    // if there is no access token
    const refreshTokenPayload = verifyJwtToken(refresh_token, config.JWT_REFRESHTOKEN_SECRET_KEY);

    // finding the existing refresh_token
    const token = await Token.findOne({ 
      user: refreshTokenPayload.user.userId, 
      refreshToken: refreshTokenPayload.refreshToken
    });

    // checking unauthorized access
    if (!token || !token?.isValid) {
      return next(Error.unAuthorized());
    }

    // then attach the existing refresh token in db to cookies
    attachCookiesToResponse(
      res, 
      refreshTokenPayload.user,
      token.refreshToken
    );

    req.user = refreshTokenPayload.user;
    next();
  } catch (error) {
    next(Error.unAuthorized());
  }
}

module.exports = authenticated;