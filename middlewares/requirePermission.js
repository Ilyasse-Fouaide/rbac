const RBAC = require("../utils/rbac")

const requirePermission = (permissions) => {
  return (req, res, next) => {
    try {
      // 
    } catch (error) {
      next(error.message)
    }
  }
}

module.exports = requirePermission
