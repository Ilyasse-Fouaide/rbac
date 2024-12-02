const { SYSTEM_ROLES } = require("../constants/roles");
const { SYSTEM_PERMISSIONS } = require('../constants/permissions')
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

class RoleService {
  static async initializeSystemRoles() {
    const roles = [
      { name: SYSTEM_ROLES.ADMIN, description: 'Administrator with full access to the system' },
      { name: SYSTEM_ROLES.USER, description: 'Regular user with limited access' },
    ];
    for (const role of roles) {
      await Role.findOneAndUpdate(
        { name: role.name },
        {
          name: role.name,
          description: role.description || null
        },
        { upsert: true, new: true } // update or insert
      );
      console.log(`- ✅ Successfully created '${role.name}' role.`)
    }
  }

  static async initializeSystemPermissions() {
    const permissions = [
      { name: SYSTEM_PERMISSIONS.MANAGE_USERS },
      { name: SYSTEM_PERMISSIONS.MANAGE_ROLES },
    ];

    for (const permission of permissions) {
      await Permission.findOneAndUpdate(
        { name: permission.name }, 
        {
          name: permission.name,
          description: permission.description || null
        },
        { upsert: true, new: true }  // update or insert
      );
      console.log(`- ✅ Successfully created '${permission.name} permission.'`)
    }
  }
}

module.exports = RoleService