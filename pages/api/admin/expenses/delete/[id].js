import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
import { deleteExpenses } from '../../../../../backend/controllers/expensesController';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).delete(deleteExpenses);

export default handler;
