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
    const decoded = JWT.verifyJwtToken(
      token,
      config.JWT_ACCESSTOKEN_SECRET_KEY,
    );

    const tokenUser = await Token.findOne({ user: decoded.userId });

    if (!tokenUser.isValid) {
      return next(Error.unAuthorized());
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticated;
