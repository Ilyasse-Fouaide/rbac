const { Schema, model } = require('mongoose');

const roleSchema = new Schema(
  {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

roleSchema.virtual('members', {
  ref: 'user_roles',
  localField: '_id',
  foreignField: 'role',
  count: true,
});

roleSchema.virtual('users', {
  ref: 'user_roles',
  localField: '_id',
  foreignField: 'role',
});

roleSchema.virtual('permissions', {
  ref: 'role_permissions',
  localField: '_id',
  foreignField: 'role',
});

const Role = model('roles', roleSchema);
module.exports = Role;
