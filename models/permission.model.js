const { Schema, model } = require('mongoose');

const permissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Permission = model('permissions', permissionSchema);
module.exports = Permission;
