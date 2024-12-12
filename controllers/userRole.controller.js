const { StatusCodes } = require('http-status-codes');
const { UserRole } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');

exports.assignUsersToRole = catchAsyncErrors(
  'assigning user to role',
  async (req, res, next) => {
    const { array } = req.body;

    if (!Array.isArray(array) || array.length === 0) {
      return next(Error.badRequest('No users to assign or invalid array.'));
    }

    const userRole = await UserRole.insertMany(array);

    res.status(StatusCodes.CREATED).json({
      message: 'Users successfully assigned to role(s)',
      count: userRole.length,
      data: userRole,
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
