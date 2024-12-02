const catchAsyncErrors = require('../utils/catchAsyncErrors');
const setCookie = require('../utils/setCookie');
const User = require('../models/user.model');
const Error = require('../custom-error');
const { StatusCodes } = require('http-status-codes');

exports.register = catchAsyncErrors(async (req, res, next) => {
  const user = new User(req.body);

  await user.save();

  setCookie(res, user.genRefreshToken());

  res.status(StatusCodes.CREATED).json(req.body);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
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

exports.profile = catchAsyncErrors(async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
});
