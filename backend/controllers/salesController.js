import Sales from '../models/salesModel';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';

export const createSales = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  // return;
  const {
    grandTotal,
    quantitySold,
    paymentMethod,
    paidAmount,
    cart,
    subTotal,
  } = req.body;
  let balanceTotal = (Number(paidAmount) - Number(grandTotal)).toFixed(2);

  const newSales = new Sales({
    saler: req.user._id,
    quantitySold,
    subTotal,
    grandTotal,
    paymentMethod,
    products: cart,
    balance: balanceTotal,
  });

  cart.filter((item) => {
    return count(item._id, item.count, item.quantity);
  });

  await newSales.save();

  res.json({
    msg: 'Order success! We will contact you to confirm the order.',
    newSales,
  });
});

const count = async (id, count, oldInStock) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      quantity: oldInStock - count,
      // sold: count + oldSold,
    },
  );
};

export const getAllSales = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({});
  res.send({
    total: sales.length,
    sales,
  });
});

export const getSalesByUser = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({ saler: req.user._id })
    .populate('saler', 'id name')
    .sort({
      createdAt: -1,
    });
  res.send({
    total: sales.length,
    sales,
  });
});

export const getSalesByUserLimit = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({ saler: req.user._id })
    .populate('saler', 'id name')
    .limit(1)
    .sort({
      createdAt: -1,
    });
  res.send(sales);
});

// GET total sales for the selected day
export const totalSalesForSelectedDay = catchAsync(async (req, res, next) => {
  // if date is provided
  const { salesStartDate, salesEndDate } = req.query;
  // console.log(req.query);
  if (salesStartDate && salesEndDate) {
    startDate = new Date(salesStartDate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(salesEndDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  Sales.find(
    { dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      var result = {
        dateTime: startDate,
      };

      if (docs) {
        var grandTotal = docs.reduce(function (p, c) {
          return p + c.grandTotal;
        }, 0.0);

        result.grandTotal = parseFloat(parseFloat(grandTotal).toFixed(2));

        res.send(result);
      } else {
        result.grandTotal = 0;
        res.send(result);
      }
    },
  );
});

// user daily sales
export const userDailySalesByDate = catchAsync(async (req, res, next) => {
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
  Sales.find(
    {
      saler: req.user._id,
      dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() },
    },
    function (err, docs) {
      var result = {
        dateTime: startDate,
      };

      if (docs) {
        var grandTotal = docs.reduce(function (p, c) {
          return p + c.grandTotal;
        }, 0.0);
        var quantitySold = docs.reduce(function (p, c) {
          return p + c.quantitySold;
        }, 0.0);

        result.grandTotal = grandTotal;
        result.quantitySold = quantitySold;
        res.send({
          result,
          docs,
        });
      } else {
        result.grandTotal = 0;
        res.send({
          result,
          docs,
        });
      }
    },
  )
    .populate('saler', 'id name')
    .sort({ dateTime: -1 });
});

// GET sales for a particular date
export const getSalesForaParticulardate = catchAsync(async (req, res, next) => {
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

  Sales.find(
    { dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      var result = {
        dateTime: startDate,
      };
      // if (docs) res.send(docs);
      if (docs) {
        var grandTotal = docs.reduce(function (p, c) {
          return p + c.grandTotal;
        }, 0.0);
        var quantitySold = docs.reduce(function (p, c) {
          return p + c.quantitySold;
        }, 0.0);

        result.grandTotal = grandTotal;
        result.quantitySold = quantitySold;
        res.send({
          result,
          docs,
        });
      } else {
        result.grandTotal = 0;
        res.send({
          result,
          docs,
        });
      }
    },
  )
    .populate('saler', '_id name')
    .sort({ dateTime: -1 });
});

export const getSalesChartInfo = catchAsync(async (req, res, next) => {
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
  Sales.aggregate([
    {
      $project: {
        grandTotal: 1,
        month: { $month: '$dateTime' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: { $toDouble: '$grandTotal' } },
      },
    },
  ]).then((documents) => {
    res.status(200).json({
      message: 'sales chart details obtaine sucessfully',
      sales: documents,
    });
  });
});

// get users daily sales by admin

export const adminGetUserDailySalesByDate = catchAsync(
  async (req, res, next) => {
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
    Sales.find(
      {
        saler: req.query.saler,
        dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() },
      },
      function (err, docs) {
        var result = {
          dateTime: startDate,
        };

        if (docs) {
          var grandTotal = docs.reduce(function (p, c) {
            return p + c.grandTotal;
          }, 0.0);
          var quantitySold = docs.reduce(function (p, c) {
            return p + c.quantitySold;
          }, 0.0);

          result.grandTotal = grandTotal;
          result.quantitySold = quantitySold;
          res.send({
            result,
            docs,
          });
        } else {
          result.grandTotal = 0;
          res.send({
            result,
            docs,
          });
        }
      },
    )
      .populate('saler', 'id name')
      .sort({ dateTime: -1 });
  },
);
