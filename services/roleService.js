const { SYSTEM_ROLES } = require("../constants/roles");
const Role = require("../models/role.model");

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
          description: role.description
        },
        { upsert: true, new: true } // update or insert
      );
      console.log(`- ✅ Successfully created '${role.name}' role`)
    }
  }
}

module.exports = RoleService
