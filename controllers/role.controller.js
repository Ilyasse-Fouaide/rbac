const { StatusCodes } = require('http-status-codes');
const { Role, RolePermission } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');

exports.create = catchAsyncErrors('create role', async (req, res) => {
  const role = new Role(req.body);
  await role.save();

  return res.status(StatusCodes.CREATED).json({
    message: 'Role created successfully',
    role: role,
  });
});

exports.index = catchAsyncErrors('show all roles', async (req, res) => {
  const roles = await Role.find().populate('members').lean();
  return res.status(StatusCodes.OK).json(roles);
});

exports.show = catchAsyncErrors('show single role', async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findById(id)
    .populate({
      path: 'users',
      select: 'user -role -_id',
      populate: {
        path: 'user',
        select: '_id email avatar',
        populate: {
          path: 'avatar',
          select: 'smallImage mediumImage largeImage',
        },
      },
    })
    .populate({
      path: 'permissions',
      select: 'permission -role -_id',
      populate: 'permission',
    })
    .lean();

  if (!role) {
    return next(Error.badRequest('Role not found'));
  }

  const users = role.users.map((user) => {
    return user.user;
  });

  const permissions = role.permissions.map((permission) => {
    return permission.permission;
  });

  const data = { ...role, members: users.length, users, permissions };

  return res.status(StatusCodes.OK).json(data);
});

exports.update = catchAsyncErrors('update role', async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!role) {
    return next(Error.notFound('Role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});

exports.delete = catchAsyncErrors('delete role', async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findByIdAndDelete(id);

  if (!role) {
    return next(Error.notFound('role not found'));
  }

  // Remove the associated roles from the `role_permissions` model when deleting roles
  await RolePermission.deleteOne({ role: id });

  res.status(StatusCodes.OK).json(role);
});

exports.deleteMultiple = catchAsyncErrors(
  'delete multiple roles',
  async (req, res, next) => {
    const { ids } = req.body; // arrays of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(Error.badRequest('An array of IDs is required'));
    }

    const result = await Role.deleteMany({ _id: { $in: ids } });

    // Remove all the associated roles from the `role_permissions` model when deleting roles
    await RolePermission.deleteMany({ role: { $in: ids } });

    res
      .status(StatusCodes.OK)
      .json({ message: `${result.deletedCount} roles deleted successfully` });
  },
);
