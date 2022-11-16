import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createProduct,
  getAllProducts,
} from '../../../../backend/controllers/productController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(getAllProducts);
handler.use(isAuth, isAdmin).post(createProduct);

export default handler;
