const { Schema, model } = require('mongoose');

const userRoleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'roles',
    required: true,
  },
});

const UserRole = model('user_roles', userRoleSchema);
module.exports = UserRole;
