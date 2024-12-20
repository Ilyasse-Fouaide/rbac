const express = require('express');
const router = express.Router();
const rolePermission = require('../controllers/rolePermission.controller');
const authentication = require('../middlewares/authentication');
const requirePermission = require('../middlewares/requirePermission');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');

// apply authentication and requirePermission middlewares to all routes
router.use(authentication);
router.use(requirePermission(SYSTEM_PERMISSIONS.ADMINISTRATOR));

router
  .route('/assign-permissions-to-role')
  .post(rolePermission.assignPermissionsToRole);

router
  .route('/remove-permissions-from-role')
  .delete(rolePermission.removePermissionsFromRole);

module.exports = router;
