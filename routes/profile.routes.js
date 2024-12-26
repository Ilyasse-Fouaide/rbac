const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile.controller');
const authentication = require('../middlewares/authentication');
const multer = require('multer');

router.use(authentication);

router.route('/').get(profile.profile);
router.route('/avatars/:userId').get(profile.userImage);
router.route('/update/:userId').patch(profile.update);

const storage = multer.memoryStorage();
const upload = multer({ storage });
router
  .route('/update/:userId/avatar')
  .post(upload.single('avatar'), profile.saveAvatar);

router.route('/update/:userId/password').patch(profile.updatePassword);

module.exports = router;
