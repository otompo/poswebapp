import Product from '../models/productModel';
import Purchase from '../models/purchaseModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { nanoid } from 'nanoid';

export const createProductsPurchase = catchAsync(async (req, res, next) => {
  let { cart, grandQuantity } = req.body;
  if (!cart || !grandQuantity) {
    return next(new AppError('Some thing is wrong', 400));
  }
  let invoiceID = nanoid(10).toLowerCase();
  const newPurchase = new Purchase({
    grandQuantity,
    products: cart,
    invoiceID: invoiceID,
  });

  cart.filter((item) => {
    return count(item._id, item.count, item.quantity);
  });

  await newPurchase.save();

  res.json({
    msg: 'Purchase success!',
    newPurchase,
  });
});

const count = async (id, count, oldInStock) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      quantity: oldInStock + count,
    },
    { new: true },
  );
};

export const getAllPurchase = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find({}).sort({ createdAt: -1 });
  res.send(purchases);
});

export const getProductsPurchaseByDate = catchAsync(async (req, res, next) => {
  if (req.query.startdate && req.query.enddate) {
    startDate = new Date(req.query.startdate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(req.query.enddate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }
  Purchase.find(
    {
      purchaseTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() },
    },
    function (err, docs) {
      var result = {
        purchaseTime: startDate,
      };

      if (docs) {
        var grandQuantity = docs.reduce(function (p, c) {
          return p + c.grandQuantity;
        }, 0);
        result.grandQuantity = grandQuantity;
        res.send({
          result,
          docs,
        });
      }
    },
  ).sort({ purchaseTime: -1 });
});
