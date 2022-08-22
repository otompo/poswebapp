import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';
import AppError from '../utils/appError';

export const getAllProductsForMobile = catchAsync(async (req, res) => {
  const perPage = 50;
  const page = req.query.page ? req.query.page : 1;
  const products = await Product.find({ active: true })
    .select('+active')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.status(200).send({
    total: products.length,
    products,
  });
});
