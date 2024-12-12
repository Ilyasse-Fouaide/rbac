const express = require('express');
const router = express.Router();
const permission = require('../controllers/permission.controller');
const authentication = require('../middlewares/authentication');
const requirePermission = require('../middlewares/requirePermission');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');

router.use(authentication);
router.use(requirePermission(SYSTEM_PERMISSIONS.ADMINISTRATOR));

router
  .route('/:id')
  .get(permission.show)
  .patch(permission.update)
  .delete(permission.delete);

router
  .route('/')
  .get(permission.index)
  .post(permission.create)
  .delete(permission.deleteMultiple);

module.exports = router;
