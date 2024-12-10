const { Schema, model } = require('mongoose');

const rolePermissionSchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles',
    required: true,
  },
  permission: {
    type: Schema.Types.ObjectId,
    ref: 'permissions',
    required: true,
  },
});

const RolePermission = model('role_permissions', rolePermissionSchema);
module.exports = RolePermission;
