const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../controllers/google.controller');

router.route('/').get(
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: false,
  }),
);

router.route('/callback').get(
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  auth.google,
);

module.exports = router;
