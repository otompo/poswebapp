import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getAllProducts } from '../../../backend/controllers/productController';
import { isAuth } from '../../../backend/middlewares';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(getAllProducts);
export default handler;
