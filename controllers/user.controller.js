const { StatusCodes } = require('http-status-codes');
const { User, UserRole, Role } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');
const saveAvatarsToFile = require('../utils/saveAvatarsToFile.utils');
const { DEFAUL_ROLE } = require('../constants/roles');

exports.create = catchAsyncErrors('create user', async (req, res, next) => {
  const { email, password, role } = req.body;
  const images = await saveAvatarsToFile(email);

  const defaultRole = await Role.findOne({
    name: DEFAUL_ROLE,
  });

  if (!defaultRole) {
    return next(Error.badRequest('Cannot found default role'));
  }

  const user = new User({
    email,
    password,
    avatars: {
      avatarUrl: images.avatarUrl,
      smallAvatarUrl: images.smallAvatarUrl,
      largeAvatarUrl: images.largeAvatarUrl,
    },
  });

  const userRole = new UserRole();

  await user.save();
  // assign user to default role
  userRole.user = user._id;
  userRole.role = role || defaultRole._id;
  await userRole.save();

  return res.status(StatusCodes.CREATED).json({
    message: 'User created successfully',
    user,
  });
});

exports.index = catchAsyncErrors('list of users', async (req, res) => {
  const defaultPageLimit = 25;
  const defaultPage = 1;

  const { search, sort, select } = req.query;

  const limit = parseInt(req.query.limit) || defaultPageLimit;
  const page = parseInt(req.query.page) || defaultPage;
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();

  let query = {};

  // search by email
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      // add search by username for example
      // { name: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort(sort ? sort.split(',').join(' ') : 'createdAt')
    .select(select ? select.split(',').join(' ') : '-__v -password')
    .populate({ path: 'roles', populate: { path: 'role' } })
    .lean();

  // Mapping user roles
  const usersData = users.map((user) => {
    // Get role names from populated roles
    const roles = user.roles.map((role) => role.role.name);

    return {
      _id: user._id,
      email: user.email,
      avatars: {
        avatarUrl: user?.avatars?.avatarUrl,
        smallAvatarUrl: user?.avatars?.smallAvatarUrl,
        largeAvatarUrl: user?.avatars?.largeAvatarUrl,
      },
      roles: roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  const data = usersData;

  res.status(StatusCodes.OK).json({
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      items: {
        count: users.length,
        totalDocument: total,
        per_page: limit,
      },
    },
    data,
  });
});

exports.show = catchAsyncErrors('show single user', async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(Error.badRequest('User not found'));
  }

  return res.status(StatusCodes.OK).json(user);
});

exports.update = catchAsyncErrors('update user', async (req, res, next) => {
  const { id: userId } = req.params;
  const { role } = req.body;

  // update user data
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(Error.notFound('User not found'));
  }

  // update the assiociated role
  await UserRole.findOneAndUpdate({ user: userId }, { role }, { new: true });

  res.status(StatusCodes.OK).json(user);
});

exports.delete = catchAsyncErrors('delete user', async (req, res, next) => {
  const { id: userId } = req.params;

  const role = await User.findByIdAndDelete(userId);

  if (!role) {
    return next(Error.notFound('role not found'));
  }

  // Remove the associated user from the `user_roles` model when deleting user
  await UserRole.deleteOne({ user: userId });

  res.status(StatusCodes.OK).json(role);
});

exports.deleteMultiple = catchAsyncErrors(
  'delete multiple users',
  async (req, res, next) => {
    const { ids } = req.body; // array of users IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(Error.badRequest('An array of IDs is required'));
    }

    const result = await User.deleteMany({ _id: { $in: ids } });

    // Remove all the associated users from the `user_roles` model when deleting users
    await UserRole.deleteMany({ user: { $in: ids } });

    res
      .status(StatusCodes.OK)
      .json({ message: `${result.deletedCount} user(s) deleted successfully` });
  },
);
