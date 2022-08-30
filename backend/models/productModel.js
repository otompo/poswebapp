import Category from './categoryModel';
import User from './userModel';

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      trim: true,
    },

    costPrice: {
      type: Number,
      trim: true,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      trim: true,
      default: 0,
    },

    expireDate: {
      type: Date,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    category: [{ type: mongoose.Schema.Types.ObjectId, ref: Category }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: User },

    slug: {
      type: String,
      required: true,
      unique: false,
      index: true,
      lowercase: true,
    },
  },

  { timestamps: true },
);

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.models && mongoose.models.Product
  ? mongoose.models.Product
  : mongoose.model('Product', productSchema);
