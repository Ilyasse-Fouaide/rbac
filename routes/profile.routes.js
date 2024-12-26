const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile.controller');
const authentication = require('../middlewares/authentication');
const multer = require('multer');
const canHaveAccess = require('../middlewares/canHaveAccess');

router.use(authentication);

router.route('/').get(profile.profile);

// apply middleware
router.use(canHaveAccess);

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/:userId/image').get(profile.userImage);
router
  .route('/:userId/avatar')
  .post(upload.single('avatar'), profile.saveAvatar);

router.route('/:userId').patch(profile.update);
router.route('/:userId/password').patch(profile.updatePassword);
router.route('/:userId').delete(profile.deleteAccount);

module.exports = router;
