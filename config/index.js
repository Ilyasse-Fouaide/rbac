const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "APP_NAME": process.env.APP_NAME,
  "APP_ENV": process.env.APP_ENV,
  "APP_URL": process.env.APP_URL,
  "APP_PORT": process.env.APP_PORT,

  "LOG_LEVEL": process.env.LOG_LEVEL,

  "CLIENT_URL": process.env.CLIENT_URL,
  "CLIENT_PORT": process.env.CLIENT_PORT,

  "DB_CONNECTION": process.env.DB_CONNECTION,
  "DB_HOST": process.env.DB_HOST,
  "DB_PORT": process.env.DB_PORT,
  "DB_DATABSE": process.env.DB_DATABSE,

  "JWT_REFRESHTOKEN_SECRET_KEY": process.env.JWT_REFRESHTOKEN_SECRET_KEY,
  "JWT_REFRESHTOKEN_LIFETIME": process.env.JWT_REFRESHTOKEN_LIFETIME,
  "JWT_ACCESSTOKEN_SECRET_KEY": process.env.JWT_ACCESSTOKEN_SECRET_KEY,
  "JWT_ACCESSTOKEN_LIFETIME": process.env.JWT_ACCESSTOKEN_LIFETIME,

  "GOOGLE_CLIENT_ID": process.env.GOOGLE_CLIENT_ID,
  "GOOGLE_CLIENT_SECRET": process.env.GOOGLE_CLIENT_SECRET,
  "GOOGLE_CALLBACK_URL": process.env.GOOGLE_CALLBACK_URL,
};