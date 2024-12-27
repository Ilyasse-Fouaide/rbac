const { StatusCodes } = require('http-status-codes');
const { User, Image } = require('../models');
const { UserRole } = require('../models');
const { Role } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { registerJwtTokens } = require('../utils/jwt.utils');
const { DEFAUL_ROLE } = require('../constants/roles');
const saveAvatarsToFile = require('../utils/saveAvatarsToFile.utils');
const config = require('../config');

exports.google = catchAsyncErrors(
  'sign in with google',
  async (req, res, next) => {
    const payload = req.user._json;
    const user = await User.findOne({ email: payload.email });
    const userRole = new UserRole();
    const image = new Image();

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
      });

      // store avatar in db
      const images = await saveAvatarsToFile(req.body.email, newUser._id);
      image.imageType = 'webp';
      image.smallImage.url = `${config.APP_URL}/${images.smallAvatarUrl}`;
      image.smallImage.path = images.smallAvatarUrl;
      image.mediumImage.url = `${config.APP_URL}/${images.mediumAvatarUrl}`;
      image.mediumImage.path = images.mediumAvatarUrl;
      image.largeImage.url = `${config.APP_URL}/${images.largeAvatarUrl}`;
      image.largeImage.path = images.largeAvatarUrl;
      await image.save();

      // assign avatar to a user
      newUser.avatar = image._id;
      await newUser.save();

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
