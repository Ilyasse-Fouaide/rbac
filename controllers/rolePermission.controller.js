const { StatusCodes } = require('http-status-codes');
const { RolePermission } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');
const filterByReference = require('../utils/filterByReference.utils');
const uniqueArray = require('../utils/uniqueArray.utils');

exports.assignPermissionsToRole = catchAsyncErrors(
  'assigning role to permission(s)',
  async (req, res, next) => {
    const { array } = req.body;

    if (!Array.isArray(array) || array.length === 0) {
      return next(
        Error.badRequest('No permission to assign or invalid array.'),
      );
    }

    const existingRolePermission = await RolePermission.find({
      role: { $in: array.map((entrie) => entrie.role) },
      permission: { $in: array.map((entrie) => entrie.permission) },
    });

    // remove all the duplication
    const uniqueRolePermissions = uniqueArray(
      filterByReference(array, existingRolePermission),
    );

    if (uniqueRolePermissions.length === 0) {
      return next(
        Error.conflict('All specified permission assignments already exist.'),
      );
    }

    const rolePermission = await RolePermission.insertMany(
      uniqueRolePermissions,
    );

    res.status(StatusCodes.CREATED).json({
      message: 'Roles successfully assigned to permission(s)',
      totalRequestedAssignments: array.length,
      uniqueAssignments: rolePermission.length,
      data: rolePermission,
    });
  },
);

exports.removePermissionsFromRole = catchAsyncErrors(
  'removing user from role',
  async (req, res, _next) => {
    const { roleIds, permissionIds } = req.body;

    const result = await RolePermission.deleteMany({
      role: { $in: roleIds },
      permission: { $in: permissionIds },
    });

    res.status(StatusCodes.OK).json({
      message: `removed ${result.deletedCount} permission successfully`,
    });
  },
);
