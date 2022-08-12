import User from '../models/userModel';
import { nanoid } from 'nanoid';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // console.log(req.body.profileImage);
  const userUpdated = await User.findByIdAndUpdate(
    user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true },
  );
  res.status(200).json(userUpdated);
});

export const makeUserAdmin = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const user = await User.findOne({ username }).exec();
  if (!user) return next(new AppError('User not found', 400));

  const roleUpdated = await User.findOneAndUpdate(
    { username },
    {
      $addToSet: { role: 'admin' },
    },
    { new: true },
  ).exec();
  res.send(`${user.name}  is now an Admin `);
  // console.log(roleUpdated);
});

export const removeAsAdmin = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const user = await User.findOne({ username });

  if (!user) return next(new AppError('User not found', 400));

  const roleUpdated = await User.findOneAndUpdate(
    { username },
    {
      $pull: { role: 'admin' },
    },
    { new: true },
  ).exec();
  res.send(`${user.name}  is remove as an Admin `);
});

//  make user an active
export const moveUserFromTrash = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const roleUpdated = await User.findOneAndUpdate(
    { username: user.username },
    {
      active: true,
    },
    { new: true },
  );
  res.send({ ok: true });
  // console.log(roleUpdated);
});

// make un-active
export const moveUserToTrash = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  const roleUpdated = await User.findOneAndUpdate(
    { username: user.username },
    {
      active: false,
    },
    { new: true },
  );
  res.send({ ok: true });
});

export const getAllUsersInTrash = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: false });

  res.status(200).json(users);
});

export const getTotalUsersInActive = catchAsync(async (req, res, next) => {
  const count = await User.countDocuments({ active: false });
  res.send(count);
});

// get users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({ active: { $ne: false } })
    .select('-password')
    .sort({ createdAt: -1 });
  res.send(users);
});

// delete user
export const removeUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.query.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const data = await User.findByIdAndRemove(user._id);
  res.json({ message: 'User Deleted' });
});

// get single user data
export const readSingleUser = catchAsync(async (req, res, next) => {
  let username = req.query.username;
  const user = await User.findOne({ username }).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.send(user);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // Get the user from the database
  const user = await User.findById(req.user._id).select('+password');

  // Check id the Posted current password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is wrong', 401));
  }

  // If password is correct update password
  user.password = req.body.password;
  user.generatedPasword = '';
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Log user in, send password

  // createSendToken(user, 200, res);
  // const token = signToken(user._id);
  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});
