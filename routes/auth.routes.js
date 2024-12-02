const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const authentication = require('../middlewares/authentication');

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.route('/logout')
  .post(auth.logout);

router.route('/profile')
  .get(authentication, auth.profile);

module.exports = router