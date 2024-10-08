import Report from '../models/reportsModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createReport = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  // return;
  const {
    totalCost,
    totalSales,
    totalExpenses,
    profit,
    subProfit,
    costStartDate,
    costEndDate,
    salesStartDate,
    salesEndDate,
    expensesStartDate,
    expensesEndDate,
  } = req.body;
  if (
    !totalCost ||
    !totalSales ||
    !totalExpenses ||
    !profit ||
    !subProfit ||
    !costStartDate ||
    !costEndDate ||
    !salesStartDate ||
    !salesEndDate ||
    !expensesStartDate ||
    !expensesEndDate
  ) {
    return next(new AppError('No data selected', 500));
  }

  const data = await new Report({
    totalCost,
    totalSales,
    totalExpenses,
    profit,
    subProfit,
    costStartDate,
    costEndDate,
    salesStartDate,
    salesEndDate,
    expensesStartDate,
    expensesEndDate,
  }).save();
  res.send(data);
});

export const getAllReports = catchAsync(async (req, res, next) => {
  const data = await Report.find().sort({ createdAt: -1 });
  res.send(data);
});

// delete
export const deleteReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.query.reportId);
  const data = await Report.findByIdAndRemove(report._id);
  if (!data) {
    return next(new AppError('Report not found', 404));
  }
  res.status(200).send({ status: 'Success' });
});
