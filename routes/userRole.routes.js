const express = require('express');
const router = express.Router();
const userRole = require('../controllers/userRole.controller');
const authentication = require('../middlewares/authentication');
const requirePermission = require('../middlewares/requirePermission');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');

// apply authentication and requirePermission middlewares to all routes
router.use(authentication);
router.use(requirePermission(SYSTEM_PERMISSIONS.ADMINISTRATOR));

router.route('/assign-user-to-role').post(userRole.assignUsersToRole);
router.route('/remove-user-from-role').delete(userRole.removeUsersFromRole);

module.exports = router;
