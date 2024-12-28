const Error = require('../custom-error');
const config = require('../config');
const { Token } = require('../models');
const { JWT } = require('../jwt');

const authenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(Error.unAuthorized('No token provided'));
  }

  try {
    // decode accessToken to get user data
    const decoded = JWT.verifyJwtToken(
      token,
      config.JWT_ACCESSTOKEN_SECRET_KEY,
    );

    // find token user in db
    const tokenUser = await Token.findOne({ user: decoded.userId });

    // unAuthorized access for logged out or banned users
    if (!tokenUser || !tokenUser.isValid) {
      return next(Error.unAuthorized());
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticated;
