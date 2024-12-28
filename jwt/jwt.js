const jwt = require('jsonwebtoken');
const config = require('../config');

class JWT {
  constructor() {
    this.ACCESS_TOKEN_SECRET = config.JWT_ACCESSTOKEN_SECRET_KEY;
    this.REFRESH_TOKEN_SECRET = config.JWT_REFRESHTOKEN_SECRET_KEY;
    this.accessTokenExpires = config.JWT_ACCESSTOKEN_LIFETIME.toString();
    this.accessTokenExpiresMs = 1000 * 60 * 15; // 15min
    this.refreshTokenExpires = config.JWT_REFRESHTOKEN_LIFETIME.toString();
    this.refreshTokenExpiresMs = 1000 * 60 * 60 * 24 * 7; // 7day
  }

  accessTokenPayload(user) {
    return { userId: user._id, email: user.email };
  }

  refreshTokenPayload(user) {
    return { userId: user._id };
  }

  generateAccessToken(user) {
    const payload = this.accessTokenPayload(user);

    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.accessTokenExpires,
    });
  }

  generateRefreshToken(user) {
    const payload = this.refreshTokenPayload(user);

    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.refreshTokenExpires,
    });
  }

  static verifyJwtToken(token, secretKey) {
    return jwt.verify(token, secretKey);
  }

  generateTokens(user) {
    const refreshToken = this.generateRefreshToken(user);
    const accessToken = this.generateAccessToken(user);

    return { refreshToken, accessToken };
  }
}

module.exports = JWT;
