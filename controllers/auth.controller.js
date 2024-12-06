const catchAsyncErrors = require('../utils/catchAsyncErrors');
const setCookie = require('../utils/setCookie');
const User = require('../models/user.model');
const Error = require('../custom-error');
const { StatusCodes } = require('http-status-codes');
const Role = require('../models/role.model');
const { SYSTEM_ROLES } = require('../constants/roles');
const UserRole = require('../models/userRole.model');

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

  setCookie(res, user.genRefreshToken());

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

  setCookie(res, user.genRefreshToken());

  res.status(StatusCodes.OK).json({ body: req.body, token: user.genRefreshToken() });
});

exports.google = catchAsyncErrors('sign in with google', async (req, res, next) => {
  const payload = req.user._json;
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    const newUser = await User.create({
      email: payload.email,
      password: "123", // Default password
    });
    setCookie(res, newUser.genRefreshToken());
    return res.status(200).json({ success: true });
  }
  setCookie(res, user.genRefreshToken());
  res.status(200).json({ success: true });
});

module.exports.logout = (req, res) => {
  //clear cookie
  res
    .status(StatusCodes.OK)
    .cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now())  // expires now
    })
    .json({ message: "Logged out!." });
}

exports.profile = catchAsyncErrors('fetch user profile', async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
});
