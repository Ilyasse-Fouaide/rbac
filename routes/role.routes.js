const express = require('express');
const router = express.Router();
const role = require('../controllers/role.controller');
const authentication = require('../middlewares/authentication');
const requirePermission = require('../middlewares/requirePermission');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');

router.use(authentication);
router.use(requirePermission(SYSTEM_PERMISSIONS.ADMINISTRATOR));

router.route('/:id').get(role.show).patch(role.update).delete(role.delete);

router.route('/').get(role.index).post(role.create).delete(role.deleteMultiple);

module.exports = router;
