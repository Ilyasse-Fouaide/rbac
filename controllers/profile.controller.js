const { StatusCodes } = require('http-status-codes');
const { User, Image } = require('../models');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const Error = require('../custom-error');
const path = require('path');
const saveImageTofile = require('../utils/saveImageTofile.utils');

exports.profile = catchAsyncErrors('fetch user profile', async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
});

// switch to image controller
exports.userImage = catchAsyncErrors(
  'fetch user profile',
  async (req, res, next) => {
    const { size = 32, dir = 'avatars' } = req.query;
    const { userId } = req.params;

    if (!userId) {
      return next(Error.badRequest('You must give userId'));
    }

    const file = path.join(
      __dirname,
      '..',
      'public',
      'images',
      `${dir}`,
      `${size}`,
      `${userId}.webp`,
    );

    if (!file) {
      return next(Error.notFound('Avatar not found'));
    }

    res.sendFile(file);
  },
);

exports.update = catchAsyncErrors(
  'update user profile',
  async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      next(Error.notFound('User not found'));
    }

    res.status(StatusCodes.OK).json(user);
  },
);

exports.updatePassword = catchAsyncErrors(
  'update user password',
  async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.params;

    if (!currentPassword || !newPassword) {
      return next(Error.badRequest('Please fill your empty fields.'));
    }

    const user = await User.findById(userId);

    if (!user) return next(Error.notFound('user not found!'));

    const isMatch = await user.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return next(Error.badRequest('Current password is incorrect'));
    }

    if (currentPassword === newPassword) {
      return next(
        Error.badRequest(
          'New password cannot be the same as the current password',
        ),
      );
    }

    user.password = newPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: 'Password updated successfully' });
  },
);

exports.saveAvatar = catchAsyncErrors(
  'update user avatar',
  async (req, res, next) => {
    if (!req.file || Object.keys(req.file).length === 0) {
      return next(Error.badRequest('No files were uploaded.'));
    }

    const { userId } = req.params;
    const image = req.file;

    // search for user
    const user = await User.findById(userId);

    if (!user) return next(Error.notFound('user not found!'));

    const uploadedImages = await saveImageTofile(
      image.buffer,
      'avatars',
      userId,
    );

    const userImage = await Image.findOneAndUpdate(
      {
        'smallImage.path': uploadedImages.smallImage.path,
        'mediumImage.path': uploadedImages.mediumImage.path,
        'largeImage.path': uploadedImages.largeImage.path,
      },
      {
        smallImage: {
          url: uploadedImages.smallImage.url,
          path: uploadedImages.smallImage.path,
        },
        mediumImage: {
          url: uploadedImages.mediumImage.url,
          path: uploadedImages.mediumImage.path,
        },
        largeImage: {
          url: uploadedImages.largeImage.url,
          path: uploadedImages.largeImage.path,
        },
      },
      { new: true, upsert: true },
    );

    user.avatar = userImage._id;
    await user.save();

    res.status(StatusCodes.OK).json(uploadedImages);
  },
);

exports.deleteAccount = catchAsyncErrors(
  'delete user account',
  async (req, res) => {
    res.status(StatusCodes.OK).json(req.user);
  },
);
