import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
import {
  getSingleExpenses,
  updateExpenses,
} from '../../../../backend/controllers/expensesController';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getSingleExpenses);
handler.use(isAuth, isAdmin).put(updateExpenses);

export default handler;
