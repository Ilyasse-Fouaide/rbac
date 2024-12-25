const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
const { UserRole } = require('../models');
const { Role } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { registerJwtTokens } = require('../utils/jwt.utils');
const { DEFAUL_ROLE } = require('../constants/roles');

exports.google = catchAsyncErrors(
  'sign in with google',
  async (req, res, next) => {
    const payload = req.user._json;
    const user = await User.findOne({ email: payload.email });
    const userRole = new UserRole();

    const defaultRole = await Role.findOne({
      name: DEFAUL_ROLE,
    });

    if (!defaultRole) {
      return next(Error.badRequest('Cannot found default role'));
    }

    // if user does not exits than mean the user is new
    if (!user) {
      const newUser = await User.create({
        email: payload.email,
        password: '123', // Default password
        avatars: {
          avatarUrl: payload.picture,
          smallAvatarUrl: payload.picture,
          largeAvatarUrl: payload.picture,
        },
      });

      // assign user to default role
      userRole.user = newUser._id;
      userRole.role = defaultRole._id;
      await userRole.save();

      await registerJwtTokens(newUser, req, res, next);
      return res.status(StatusCodes.OK).json({ message: 'logged in' });
    }
    await registerJwtTokens(user, req, res, next);
    res.status(StatusCodes.OK).json({ message: 'logged in' });
  },
);
