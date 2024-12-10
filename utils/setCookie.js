const config = require('../config');

const setCookie = (res, name, token, expires) => {
  return res.cookie(name, token, {
    httpOnly: true,
    secure: config.APP_ENV === 'production',
    // signed: true,
    expires: new Date(Date.now() + expires),
  });
};

module.exports = setCookie;
