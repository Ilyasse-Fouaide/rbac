class RBAC {
  static async getUserPermissions() {};

  static async checkPermission(userId, requiredPermission) {};
};

module.exports = RBAC
