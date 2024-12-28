const catchAsyncErrors = require('../utils/catchAsyncErrors');
const { User, Image, UserRole } = require('../models');
const Error = require('../custom-error');
const { StatusCodes } = require('http-status-codes');
const { Role } = require('../models');
const { DEFAUL_ROLE } = require('../constants/roles');
const { Token } = require('../models');
const { registerJwtTokens, JWT } = require('../jwt');
const saveAvatarsToFile = require('../utils/saveAvatarsToFile.utils');
const config = require('../config');

exports.register = catchAsyncErrors(
  'registering user',
  async (req, res, next) => {
    const user = new User(req.body);
    const userRole = new UserRole();
    const image = new Image();

    await user.save();

    const defaultRole = await Role.findOne({
      name: DEFAUL_ROLE,
    });

    if (!defaultRole) {
      return next(Error.badRequest('Cannot found default role'));
    }

    // store avatar in db
    const images = await saveAvatarsToFile(req.body.email, user._id);
    image.imageType = 'webp';
    image.smallImage.url = `${config.APP_URL}/${images.smallAvatarUrl}`;
    image.smallImage.path = images.smallAvatarUrl;
    image.mediumImage.url = `${config.APP_URL}/${images.mediumAvatarUrl}`;
    image.mediumImage.path = images.mediumAvatarUrl;
    image.largeImage.url = `${config.APP_URL}/${images.largeAvatarUrl}`;
    image.largeImage.path = images.largeAvatarUrl;
    await image.save();

    // assign avatar to a user
    user.avatar = image._id;
    await user.save();

    // assign user to default role
    userRole.user = user._id;
    userRole.role = defaultRole._id;
    await userRole.save();

    res.status(StatusCodes.CREATED).json(req.body);
  },
);

exports.login = catchAsyncErrors('sign-in user', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(Error.badRequest('email or password required'));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(Error.notFound('Invalid Credentials'));
  }

  const validPassword = await user.comparePassword(password, user.password);

  if (!validPassword) {
    return next(Error.badRequest('Invalid Credentials'));
  }

  const tokens = await registerJwtTokens(user, req, res, next);

  res.status(StatusCodes.OK).json(tokens);
});

exports.token = catchAsyncErrors('refreshing token', async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return next(Error.unAuthorized());

  // decode the refreshToken to get userId from payload
  const decoded = JWT.verifyJwtToken(
    refreshToken,
    config.JWT_REFRESHTOKEN_SECRET_KEY,
  );

  // find the user
  const user = await User.findById(decoded.userId);
  if (!user) return next(Error.notFound('User not found'));

  const userToken = await Token.findOne({ user: user._id, refreshToken });

  if (!userToken || !userToken.isValid) return next(Error.unAuthorized());

  // generate new accessToken
  const jwt = new JWT();
  const newAccessToken = jwt.generateAccessToken(user);

  res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
});

exports.logout = async (req, res, next) => {
  // delete the token
  const tokenUser = await Token.findOneAndDelete({
    user: req.user.userId,
  });

  if (!tokenUser) return next(Error.notFound('Token user not found'));

  // clear refreshToken cookie
  res
    .status(StatusCodes.OK)
    .cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()), // expires now
    })
    .json({ message: 'Logged out!.' });
};
