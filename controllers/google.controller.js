const { Image } = require('../models');
const { UserRole } = require('../models');
const { Role } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { registerJwtTokens } = require('../jwt');
const { DEFAUL_ROLE } = require('../constants/roles');
const saveAvatarsToFile = require('../utils/saveAvatarsToFile.utils');
const config = require('../config');

exports.google = catchAsyncErrors(
  'sign in with google',
  async (req, res, next) => {
    try {
      const user = req.user.user;
      const profile = req.user.profile;
      const userIsNew = req.user.new;

      if (userIsNew) {
        const userRole = new UserRole();
        const image = new Image();

        const defaultRole = await Role.findOne({
          name: DEFAUL_ROLE,
        });

        if (!defaultRole) {
          return next(Error.badRequest('Cannot found default role'));
        }

        // store avatar in db
        const images = await saveAvatarsToFile(profile.displayName, user._id);
        image.imageType = 'webp';
        image.smallImage.url = `${config.APP_URL}/${images.smallAvatarUrl}`;
        image.smallImage.path = images.smallAvatarUrl;
        image.mediumImage.url = `${config.APP_URL}/${images.mediumAvatarUrl}`;
        image.mediumImage.path = images.mediumAvatarUrl;
        image.largeImage.url = `${config.APP_URL}/${images.largeAvatarUrl}`;
        image.largeImage.path = images.largeAvatarUrl;
        await image.save();

        // assign the avatar to user
        user.avatar = image._id;
        await user.save();

        // assign user to default role
        userRole.user = user._id;
        userRole.role = defaultRole._id;
        await userRole.save();

        const tokens = await registerJwtTokens(user, req, res, next);

        return res.redirect(
          `${config.CLIENT_URL}/auth/success?accessToken=${tokens.accessToken}`,
        );
      }

      const tokens = await registerJwtTokens(user, req, res, next);
      res.redirect(
        `${config.CLIENT_URL}/auth/success?accessToken=${tokens.accessToken}`,
      );
    } catch (error) {
      res.redirect(`${config.CLIENT_URL}/auth/error?metadata=${error}`);
    }
  },
);
