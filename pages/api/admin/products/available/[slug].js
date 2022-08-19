import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import {
  makeProductInActive,
  makeProductActive,
} from '../../../../../backend/controllers/productController';
import { isAdmin, isAuth } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).put(makeProductInActive);
handler.use(isAuth, isAdmin).patch(makeProductActive);

export default handler;
