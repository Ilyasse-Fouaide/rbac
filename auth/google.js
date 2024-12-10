const config = require('../config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googlestrategy = new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_CALLBACK_URL,
},
function (accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
);

module.exports = googlestrategy;
