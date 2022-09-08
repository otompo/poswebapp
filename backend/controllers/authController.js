import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import cloudinary from 'cloudinary';
import { signToken } from '../middlewares/auth';

// cluodnary

cloudinary.config({
  cloud_name: 'codesmart',
  api_key: '924552959278257',
  api_secret: 'nyl74mynmNWo5U0rzF8LqzcCE8U',
});

export const signin = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    active: { $ne: false },
  }).select('+password +active');

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      user,
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password' });
  }
});

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const readUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+active');
  user.name = req.body.name;
  user.email = req.body.email;
  user.contactNum = req.body.contactNum;
  await user.save();
  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    contactNum: user.contactNum,
    username: user.username,
    active: user.active,
    generatedPasword: user.generatedPasword,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user._id).select('+password');
  const { prevPassword, newPassword, c_password } = req.body;
  // Check id the Posted current password is correct

  if (!bcrypt.compareSync(prevPassword, userData.password)) {
    return next(new AppError('previous password is wrong', 401));
  }

  if (c_password !== newPassword) {
    return next(new AppError('Password do not mach', 500));
  }

  if (!newPassword || newPassword.length < 6) {
    return next(new AppError('Password should be 6 characters long', 500));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      generatedPasword: '',
      password: bcrypt.hashSync(newPassword),
    },
    { new: true },
  );
  res.send(user);
});
