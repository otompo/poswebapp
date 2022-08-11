import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { totalExpensesForSelectedDays } from '../../../../backend/controllers/expensesController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuth, isAdmin).get(totalExpensesForSelectedDays);

export default handler;
