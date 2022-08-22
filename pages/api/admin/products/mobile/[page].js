import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { getAllProductsForMobile } from '../../../../../backend/controllers/productsMobileController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getAllProductsForMobile);

export default handler;
