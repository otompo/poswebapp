import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },

    name: {
      trim: true,
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [50, 'Your name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter your email'],
      validate: [validator.isEmail, 'Please enter valid email address'],
    },

    password: {
      type: String,
      trim: true,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Your password must be longer than 6 characters'],
      select: false,
    },

    role: {
      type: [String],
      default: ['staff'],
      enum: ['staff', 'admin'],
    },

    contactNum: {
      type: String,
      unique: true,
      required: [true, 'Please enter your phone number'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    generatedPasword: {
      type: String,
    },
    last_login_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.User
  ? mongoose.models.User
  : mongoose.model('User', userSchema);
