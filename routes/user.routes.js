const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller');
const authentication = require('../middlewares/authentication');
const requirePermission = require('../middlewares/requirePermission');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');

router.use(authentication);
router.use(requirePermission(SYSTEM_PERMISSIONS.ADMINISTRATOR));

router.route('/:id').patch(user.update).delete(user.delete).get(user.show);
router.route('/').get(user.index).post(user.create).delete(user.deleteMultiple);

module.exports = router;
