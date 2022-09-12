import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getSingleProductsByCategory } from '../../../backend/controllers/productController';
import { isAuth } from '../../../backend/middlewares';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(getSingleProductsByCategory);

export default handler;
