const express = require('express');
const router = express.Router();
const role = require('../controllers/role.controller');

router.route('/:id')
  .get(role.show)
  .patch(role.update)
  .delete(role.delete)

router.route('/')
  .get(role.index)
  .post(role.create)
  .delete(role.deleteMultiple);

module.exports = router