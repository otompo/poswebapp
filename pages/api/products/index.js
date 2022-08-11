import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getAllProducts } from '../../../backend/controllers/productController';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).get(getAllProducts);
export default handler;
