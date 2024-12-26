const User = require('./user.model');
const Image = require('./image.model');
const Role = require('./role.model');
const UserRole = require('./userRole.model');
const Permission = require('./permission.model');
const RolePermission = require('./rolePermission.model');
const Token = require('./token.model');

module.exports = {
  User,
  Image,
  Role,
  UserRole,
  Permission,
  RolePermission,
  Token,
};
