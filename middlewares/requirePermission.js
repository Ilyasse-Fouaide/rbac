const RBAC = require("../utils/rbac");
const Error = require('../custom-error')

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.user;
      const authorized = await RBAC.checkPermission(userId, permission);

      if (!authorized) {
        next(Error.unAuthorized('Permission denied'));
      }

      next();
    } catch (error) {
      next(error.message);
    }
  }
}

module.exports = requirePermission;
