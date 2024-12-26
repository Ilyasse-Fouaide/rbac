const { User } = require('../models');

class RBAC {
  static async getUserPermissions(userId) {
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

  static async getUserRole(userId) {
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: { path: 'role' },
    });

    return user.roles.map((role) => role.role.name);
  }

  static async checkPermission(userId, requiredPermission) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(requiredPermission);
  }

  static async isAdmin(userId) {
    const roles = await this.getUserRole(userId);
    return roles.includes('admin');
  }
}

module.exports = RBAC;
