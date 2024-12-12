const { SYSTEM_ROLES } = require('../constants/roles');
const { SYSTEM_PERMISSIONS } = require('../constants/permissions');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermission.model');

class RoleService {
  // get roles from db
  static async roles() {
    return await Role.find();
  }

  // get permissions from db
  static async permissions() {
    return await Permission.find();
  }

  // create default roles
  static async initializeSystemRoles() {
    const roles = [
      {
        name: SYSTEM_ROLES.ADMIN,
        description: 'Administrator with full access to the system',
      },
      {
        name: SYSTEM_ROLES.USER,
        description: 'Regular user with limited access',
      },
    ];

    for (const role of roles) {
      await Role.findOneAndUpdate(
        { name: role.name },
        {
          name: role.name,
          description: role.description || null,
        },
        { upsert: true, new: true }, // update or insert
      );
      console.log(`- ✅ Successfully created '${role.name}' role.`);
    }
  }

  // create default permissions
  static async initializeSystemPermissions() {
    const permissions = [{ name: SYSTEM_PERMISSIONS.ADMINISTRATOR }];

    for (const permission of permissions) {
      await Permission.findOneAndUpdate(
        { name: permission.name },
        {
          name: permission.name,
          description: permission.description || null,
        },
        { upsert: true, new: true }, // update or insert
      );
      console.log(`- ✅ Successfully created '${permission.name} permission.'`);
    }
  }

  static async assignPermissionToRole() {
    // get roles from db
    const roles = await this.roles();

    // default admin permissions
    const adminPermissions = (await this.permissions()).filter(
      (permission) => permission.name === SYSTEM_PERMISSIONS.ADMINISTRATOR,
    );

    // assign permissions to admin
    adminPermissions.map(async (permission) => {
      // get admin role id
      const adminId = roles.find((el) => el.name === SYSTEM_ROLES.ADMIN)._id;

      await RolePermission.findOneAndUpdate(
        { role: adminId, permission: permission._id },
        { role: adminId, permission: permission._id },
        { upsert: true, new: true },
      );
      console.log(
        `- ✅ Successfully assigned '${permission.name}' to '${SYSTEM_ROLES.ADMIN}'`,
      );
    });
  }
}

module.exports = RoleService;
