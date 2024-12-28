const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile.controller');
const authentication = require('../middlewares/authentication');
const multer = require('multer');
const canHaveAccess = require('../middlewares/canHaveAccess');

router.route('/:userId/image').get(profile.userImage);

router.use(authentication);

router.route('/').get(profile.profile);

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
router
  .route('/:userId/avatar')
  .post(canHaveAccess, upload.single('avatar'), profile.saveAvatar);

router.route('/:userId').patch(canHaveAccess, profile.update);
router.route('/:userId/password').patch(canHaveAccess, profile.updatePassword);
router.route('/:userId').delete(canHaveAccess, profile.deleteAccount);

module.exports = router;
