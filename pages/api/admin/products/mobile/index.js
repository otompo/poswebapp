import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { productsCount } from '../../../../../backend/controllers/productsMobileController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(productsCount);

export default handler;
