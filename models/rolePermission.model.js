const { Schema, model } = require('mongoose');

const rolePermissionSchema = new Schema({
  role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  permission: { 
    type: Schema.Types.ObjectId, 
    ref: 'Permission', 
    required: true 
  }
});

const RolePermission = model('role_permissions', rolePermissionSchema);
module.exports = RolePermission;
