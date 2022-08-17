import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import {
  createProductsPurchase,
  getAllPurchase,
} from '../../../../../backend/controllers/purchaseController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(createProductsPurchase);
handler.use(isAuth, isAdmin).get(getAllPurchase);

export default handler;
