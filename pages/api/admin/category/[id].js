import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { deleteCategory } from '../../../../backend/controllers/categoryController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).delete(deleteCategory);

export default handler;
