const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const { registerJwtTokens } = require("../utils/jwt.utils");

exports.google = catchAsyncErrors('sign in with google', async (req, res, next) => {
  const payload = req.user._json;
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    const newUser = await User.create({
      email: payload.email,
      password: "123", // Default password
    });
    await registerJwtTokens(newUser, req, res, next);
    return res.status(StatusCodes.OK).json({ message: 'logged in' });
  }
  await registerJwtTokens(user, req, res, next);
  res.status(StatusCodes.OK).json({ message: 'logged in' });
});