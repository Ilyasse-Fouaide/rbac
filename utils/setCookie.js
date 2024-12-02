const config = require("../config");

const setCookie = (res, token) => {
  return res
    .cookie('refresh_token', token,
      {
        httpOnly: true,
        secure: config.APP_ENV === 'production',
        sameSite: 'Strict'
      });
};

module.exports = setCookie;