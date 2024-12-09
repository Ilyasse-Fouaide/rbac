const catchAsyncErrors = require('../utils/catchAsyncErrors');
const User = require('../models/user.model');
const Error = require('../custom-error');
const { StatusCodes } = require('http-status-codes');
const Role = require('../models/role.model');
const { SYSTEM_ROLES } = require('../constants/roles');
const UserRole = require('../models/userRole.model');
const Token = require('../models/token.model');
const { registerJwtTokens } = require('../utils/jwt.utils');

exports.register = catchAsyncErrors('registering user', async (req, res, next) => {
  const user = new User(req.body);
  const userRole = new UserRole();

  const defaultRole = await Role.findOne({ name: SYSTEM_ROLES.USER });

  if (!defaultRole) {
    return next(Error.badRequest('Cannot found default role'));
  }

  await user.save();
  // assign user to default role
  userRole.user = user._id;
  userRole.role = defaultRole._id;
  await userRole.save();

  res.status(StatusCodes.CREATED).json(req.body);
});

exports.login = catchAsyncErrors('sign-in user', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(Error.badRequest(`email or password required`));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(Error.notFound('Invalid Credentials'));
  }

  const validPassword = await user.comparePassword(password, user.password);

  if (!validPassword) {
    return next(Error.badRequest('Invalid Credentials'));
  }

  await registerJwtTokens(user, req, res, next);

  res.status(StatusCodes.OK).json({});
});

exports.logout = async (req, res) => {
  // delete the token
  await Token.findOneAndDelete({ user: req.user.userId });

  // clear both tokens cookie
  res
    .status(StatusCodes.OK)
    .cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now())  // expires now
    })
    .cookie('access_token', '', {
      httpOnly: true,
      expires: new Date(Date.now())  // expires now
    })
    .json({ message: "Logged out!." });
}

exports.profile = catchAsyncErrors('fetch user profile', async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
});
