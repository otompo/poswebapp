import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { getAllProductsForMobile } from '../../../../../backend/controllers/productsMobileController';
import { isAuth } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(getAllProductsForMobile);

export default handler;
