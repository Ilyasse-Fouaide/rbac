const config = require('../config');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

const googlestrategy = new GoogleStrategy(
  {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      const email = profile.emails[0].value;
      // generate random password for google users
      const password =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).toUpperCase().slice(2);

      const user = await User.findOne({ email });

      if (!user) {
        const newUser = await User.create({ email, password });
        return cb(null, { profile, user: newUser, new: true });
      }

      return cb(null, { profile, user, new: false });
    } catch (error) {
      cb(error, null);
    }
  },
);

module.exports = googlestrategy;
