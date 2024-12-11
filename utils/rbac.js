const User = require('../models/user.model');

class RBAC {
  static async getUserPermissions(userId = '674f3e5cf51682b3fd602c77') {
    const user = await User.findById(userId)
      .populate({
        path: 'roles',
        populate: {
          path: 'role',
          populate: {
            path: 'permissions',
            populate: 'permission',
          },
        },
      })
      .lean();

    return user.roles.flatMap((role) =>
      role.role.permissions.map((el) => el.permission.name),
    );
  }

  static async checkPermission(userId, requiredPermission) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(requiredPermission);
  }
}

module.exports = RBAC;
