const { StatusCodes } = require('http-status-codes');
const { UserRole } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');

exports.assignUsersToRole = catchAsyncErrors(
  'assigning user to role',
  async (req, res, next) => {
    // expect array of objects in the request body
    const { array } = req.body;

    if (!Array.isArray(array) || array.length === 0) {
      return next(Error.badRequest('No users to assign or invalid array.'));
    }

    // finding if they are duplicated user role
    const existingUserRole = await UserRole.find({
      user: { $in: array.map((entry) => entry.user) },
      role: { $in: array.map((entry) => entry.role) },
    });

    // getting rid of duplicated fields
    const existingUserRoleSet = new Set(
      existingUserRole.map((entry) => `${entry.user}-${entry.role}`),
    );

    // filtering duplicated objects in the given array
    const uniqueUserRole = array.filter(
      (entry) => !existingUserRoleSet.has(`${entry.user}-${entry.role}`),
    );

    if (uniqueUserRole.length === 0) {
      return next(
        Error.conflict('All specified role assignments already exist.'),
      );
    }

    const userRoles = await UserRole.insertMany(uniqueUserRole);

    res.status(StatusCodes.CREATED).json({
      message: 'Users successfully assigned to role(s)',
      totalRequestedAssignments: array.length,
      uniqueAssignments: userRoles.length,
      data: userRoles,
    });
  },
);

exports.removeUsersFromRole = catchAsyncErrors(
  'removing user from role',
  async (req, res, _next) => {
    const { userIds, roleIds } = req.body;

    await UserRole.deleteMany({
      user: { $in: userIds },
      role: { $in: roleIds },
    });

    res.status(StatusCodes.OK).json({ message: 'removed role successfully' });
  },
);
