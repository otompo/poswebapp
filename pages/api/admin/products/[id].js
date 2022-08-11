import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { removeProduct } from '../../../../backend/controllers/productController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).delete(removeProduct);

export default handler;
