const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const UserRole = require('./userRole.model');
const Image = require('./image.model');
const fs = require('fs/promises');
const path = require('path');
const Error = require('../custom-error');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: 'images',
    },
    password: {
      type: String,
      required: [true, 'password required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual('roles', {
  ref: 'user_roles',
  localField: '_id',
  foreignField: 'user',
  // By default, a populated virtual is an array.
  // the populated virtual will be a single doc or `null`.
  // justOne: true
});

userSchema.pre('save', function () {
  const user = this;
  /**
   * Returns true if any of the given paths are modified, else false. If no arguments, returns true if any path in this document is modified.
   */
  if (!user.isModified('password')) return;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(user.password, salt);

  user.password = hashPassword;
});

userSchema.methods.comparePassword = async function (
  passwordString,
  hashedPassword,
) {
  return await bcrypt.compare(passwordString, hashedPassword);
};

// handle cascading delete
userSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getQuery());

  if (!user) return next();

  await Promise.all([
    UserRole.deleteOne({ user: user._id }),
    Image.findByIdAndDelete(user.avatar),
    deleteUserImages(user._id, next),
  ]);
});

userSchema.pre('deleteMany', async function (next) {
  const users = await this.model.find(this.getQuery());

  if (users.length === 0) {
    return next(Error.notFound('No users found for the provided IDs'));
  }

  await Promise.all(
    users.map(async (user) => {
      await UserRole.deleteOne({ user: user._id });
      await Image.findByIdAndDelete(user.avatar);
      deleteUserImages(user._id, next);
    }),
  );
});

// Utility function for deleting images
const deleteUserImages = async (userId, next) => {
  const defaultImageSizes = [32, 64, 128];
  const baseDir = path.join(__dirname, '..', 'public', 'images', 'avatars');

  return await Promise.all(
    defaultImageSizes.map(async (el) => {
      const pathToImages = path.join(baseDir, `${el}`, `${userId}.webp`);
      try {
        await fs.access(pathToImages);
        await fs.unlink(pathToImages);
      } catch (error) {
        next(Error.badRequest(error));
      }
    }),
  );
};

const User = model('users', userSchema);
module.exports = User;
