const { StatusCodes } = require('http-status-codes');
const Role = require('../models/role.model');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');

exports.create = catchAsyncErrors(async (req, res, next) => {
  const role = new Role(req.body);
  await role.save();

  return res.status(StatusCodes.CREATED).json({
      message: 'Role created successfully',
      role: role
  });
});

exports.index = catchAsyncErrors(async (req, res, next) => {
  const roles = await Role.find();
  return res.status(StatusCodes.OK).json(roles);
});


exports.show = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (!role) {
      return next(Error.badRequest('Role not found'));
  }

  return res.status(StatusCodes.OK).json(role);
});


exports.update = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

  if (!role) {
    return next(Error.notFound('Role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});


exports.delete = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findByIdAndDelete(id);

  if (!role) {
    return next(Error.notFound('project role not found'));
  }

  res.status(StatusCodes.OK).json(role);
});


exports.deleteMultiple = catchAsyncErrors(async (req, res, next) => {
  const { ids } = req.body;  // arrays of IDs

  if (!Array.isArray(ids) || ids.length === 0) {
    return next(Error.badRequest('An array of IDs is required'));
  }

  const result = await Role.deleteMany({ _id: { $in: ids } });
  res.status(StatusCodes.OK).json({ message: `${result.deletedCount} roles deleted successfully` });
});
