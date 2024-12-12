const { StatusCodes } = require('http-status-codes');
const { Permission } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');

exports.create = catchAsyncErrors('create permission', async (req, res) => {
  const permission = new Permission(req.body);
  await permission.save();

  return res.status(StatusCodes.CREATED).json({
    message: 'Permission created successfully',
    permission: permission,
  });
});

exports.index = catchAsyncErrors('show all permissions', async (req, res) => {
  const permissions = await Permission.find().lean();
  return res.status(StatusCodes.OK).json(permissions);
});

exports.show = catchAsyncErrors(
  'show single permissions',
  async (req, res, next) => {
    const { id } = req.params;

    const permission = await Permission.findById(id);

    if (!permission) {
      return next(Error.badRequest('Permission not found'));
    }

    return res.status(StatusCodes.OK).json(permission);
  },
);

exports.update = catchAsyncErrors(
  'update permission',
  async (req, res, next) => {
    const { id } = req.params;

    const permission = await Permission.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!permission) {
      return next(Error.notFound('Permission not found'));
    }

    res.status(StatusCodes.OK).json(permission);
  },
);

exports.delete = catchAsyncErrors(
  'delete permission',
  async (req, res, next) => {
    const { id } = req.params;

    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      return next(Error.notFound('permission not found'));
    }

    res.status(StatusCodes.OK).json(permission);
  },
);

exports.deleteMultiple = catchAsyncErrors(
  'delete multiple permissions',
  async (req, res, next) => {
    const { ids } = req.body; // arrays of IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(Error.badRequest('An array of IDs is required'));
    }

    const result = await Permission.deleteMany({ _id: { $in: ids } });
    res.status(StatusCodes.OK).json({
      message: `${result.deletedCount} permissions deleted successfully`,
    });
  },
);
