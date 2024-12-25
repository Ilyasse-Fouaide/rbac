const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
    },
    avatars: {
      avatarUrl: String,
      smallAvatarUrl: String,
      largeAvatarUrl: String,
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

const User = model('users', userSchema);
module.exports = User;
