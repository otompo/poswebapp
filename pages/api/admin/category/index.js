import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createCategory,
  getAllCategories,
} from '../../../../backend/controllers/categoryController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(createCategory);

handler.use(isAuth, isAdmin).get(getAllCategories);

export default handler;
