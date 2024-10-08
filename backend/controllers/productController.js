import Product from '../models/productModel';
import Category from '../models/categoryModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';
import AppError from '../utils/appError';
const { Parser } = require('json2csv');
// const nodemailer = require('nodemailer');

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    quantity,
    costPrice,
    sellingPrice,
    expireDate,
    selectedCategory,
  } = req.body;

  let slug = slugify(name).toLowerCase();
  const alreadyExist = await Product.findOne({ slug });
  if (alreadyExist) {
    return next(new AppError('Product name already exist', 400));
  }

  const products = await new Product({
    name,
    quantity,
    expireDate,
    costPrice,
    sellingPrice,
    slug,
    category: selectedCategory,
    // user: req.user._id,
  }).save();

  res.send(products);
});

// get all works
export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ active: true })
    .select('+active')
    .sort({ createdAt: -1 })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.status(200).send({
    total: products.length,
    products,
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.query.slug })
    .select('+active')
    .populate('category', '_id name slug');
  res.send(product);
});

// products instock
export const getProductsInstock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $gt: [{ $toDouble: '$quantity' }, 30] },
  })
    .select('+active')
    .populate('category', '_id name slug')
    .populate('user', '_id name')
    .sort({ createdAt: -1 });

  res.send({
    total: products.length,
    products,
  });
});

// products out of stock
export const getProductsOutOfStock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $lte: [{ $toDouble: '$quantity' }, 30] },
  })
    .select('+active')
    .populate('category', '_id name slug')
    .populate('user', '_id name')
    .sort({ createdAt: -1 });
  res.send({ total: products.length, products });
});

// abouttooutofstock
export const getProductAboutToOutofStock = catchAsync(
  async (req, res, next) => {
    const products = await Product.find({
      $and: [
        { $expr: { $lte: [{ $toDouble: '$quantity' }, 50] } },
        { $expr: { $gte: [{ $toDouble: '$quantity' }, 30] } },
      ],
    })
      .select('+active')
      .populate('category', '_id name slug')
      .populate('user', '_id name')
      .sort({ createdAt: -1 });
    res.send({ total: products.length, products });
  },
);

// getExpired
export const getExpiredProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find({ expireDate: { $lte: new Date() } })
    .select('+active')
    .populate('category', '_id name slug')
    .populate('user', '_id name')
    .sort({ createdAt: -1 });
  res.send({ total: products.length, products });
});

// getAboutToExpire
export const getProductsAboutToExpire = catchAsync(async (req, res, next) => {
  var date = new Date();
  var date10 = new Date(date.getTime());
  date10.setDate(date10.getDate() + 10);

  const products = await Product.find({
    expireDate: { $lte: new Date(date10), $gte: new Date() },
  })
    .select('+active')
    .populate('category', '_id name slug')
    .populate('user', '_id name')
    .sort({ createdAt: -1 });
  res.send({ total: products.length, products });
});

// updateQuantity
export const updateProductQuantity = catchAsync(async (req, res, next) => {
  let { quantity, currentQty } = req.body;
  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  let newQuantity = Number(quantity) + Number(currentQty);

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    {
      // ...req.body,
      quantity: newQuantity,
    },
    {
      new: true,
    },
  );

  res.json(updatedProduct);
});

// update product
export const updateProduct = catchAsync(async (req, res, next) => {
  const { name, selectedCategory, costPrice, quantity, sellingPrice } =
    req.body;

  const { slug } = req.query;
  const product = await Product.findOne({ slug });

  const update = await Product.findOneAndUpdate(
    { slug: product.slug },
    {
      slug: slugify(name).toLowerCase(),
      name,
      category: selectedCategory,
      costPrice,
      quantity,
      sellingPrice,
      ...req.body,
    },
    {
      new: true,
    },
  );
  res.send(update);
});

// delete product
export const removeProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const data = await Product.findByIdAndRemove(product._id);

  res.json({ message: 'Product Deleted' });
});

export const exportProductData = catchAsync(async (req, res, next) => {
  const fields = [
    'name',
    'quantity',
    'costPrice',
    'sellingPrice',
    'category',
    'expireDate',
  ];
  const opts = { fields };

  const product = await Product.find({});
  const parser = new Parser(opts);
  const csv = parser.parse(product);
  res.status(200).send(Buffer.from(csv));
});

export const importProductData = catchAsync(async (req, res, next) => {
  const data = Product.insertMany(req.body.csvFile);
  res.send(data);
});

export const makeProductInActive = catchAsync(async (req, res, next) => {
  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError('User not found', 404));
  }
  const updatedProduct = await Product.findOneAndUpdate(
    { slug: product.slug },
    {
      active: false,
      // quantity: 0,
    },
    { new: true },
  );
  res.send({ ok: true });
});

export const makeProductActive = catchAsync(async (req, res, next) => {
  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError('User not found', 404));
  }
  const updatedProduct = await Product.findOneAndUpdate(
    { slug: product.slug },
    {
      active: true,
    },
    { new: true },
  );
  res.send({ ok: true });
});

export const updateAppQuantity = catchAsync(async (req, res, next) => {
  const data = await Product.updateMany(
    { sellingPrice: 16 },
    { slug: 'calmel' },
    { new: true },
  );
  res.send({ ok: true });
});

export const getSingleProductsByCategory = catchAsync(
  async (req, res, next) => {
    const category = await Category.findById(req.query.id);
    if (!category) {
      return next(new AppError('category not found', 404));
    }
    let categoryId = category._id;
    const product = await Product.find({ category: categoryId })
      .populate('category', '_id name')
      .sort({ createdAt: -1 });
    // .select(
    //   "_id name slug category createdAt featuredImage description location"
    // );
    res.send(product);
  },
);
