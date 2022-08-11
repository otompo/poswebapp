import {
  createExpenses,
  getAllExpenses,
} from '../../../../backend/controllers/expensesController';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import dbConnect from '../../../../backend/config/dbConnect';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
import nc from 'next-connect';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(createExpenses);
handler.use(isAuth, isAdmin).get(getAllExpenses);

export default handler;
