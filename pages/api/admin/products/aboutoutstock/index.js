import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { getProductAboutToOutofStock } from '../../../../../backend/controllers/productController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getProductAboutToOutofStock);

export default handler;
