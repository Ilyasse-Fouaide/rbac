const catchAsyncErrors = require('../utils/catchAsyncErrors');
const setCookie = require('../utils/setCookie');
const User = require('../models/user.model');
const Error = require('../custom-error');
const { StatusCodes } = require('http-status-codes');
const Role = require('../models/role.model');
const { SYSTEM_ROLES } = require('../constants/roles');
const UserRole = require('../models/userRole.model');
const { v4: uuidv4 } = require('uuid');
const Token = require('../models/token.model');
const { verifyJwtToken, registerJwtRefreshToken } = require('../utils/jwt.utils');
const config = require('../config');

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

  const { refreshToken, accessToken } = await registerJwtRefreshToken(user, req, res, next)

  res.status(StatusCodes.OK).json({ refreshToken, accessToken });
});

exports.google = catchAsyncErrors('sign in with google', async (req, res, next) => {
  const payload = req.user._json;
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    const newUser = await User.create({
      email: payload.email,
      password: "123", // Default password
    });
    const { refreshToken, accessToken } = await registerJwtRefreshToken(newUser, req, res, next);
    return res.status(200).json({ refreshToken, accessToken});
  }
  const { refreshToken, accessToken } = await registerJwtRefreshToken(user, req, res, next);
  res.status(StatusCodes.OK).json({ refreshToken, accessToken});
});

exports.refreshToken = catchAsyncErrors('refreshing token', async (req, res, next) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return next(Error.unAuthorized());
  }

  verifyJwtToken(refresh_token, config.JWT_REFRESHTOKEN_SECRET_KEY, async (err, decoded) => {
    if (err) return next(Error.unAuthorized());

    const user = await User.findById(decoded.userId);
    if (!user) return next(Error.notFound('User not found'));

    // generate new access token
    const newAccessToken = user.genAccessToken();
    res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
  });
});

exports.logout = async (req, res) => {
  // set refresh token to null
  await Token.findOneAndUpdate(
    { user: req.user.userId }, 
    { refreshToken: null },
  );

  // clear refresh_token cookie
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
