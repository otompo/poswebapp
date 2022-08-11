import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import {
  createSales,
  getSalesByUser,
} from '../../../backend/controllers/salesController';
import { isAuth } from '../../../backend/middlewares';

import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuth).post(createSales);
handler.use(isAuth).get(getSalesByUser);

export default handler;
