import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { totalSalesForSelectedDay } from '../../../../backend/controllers/salesController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuth, isAdmin).get(totalSalesForSelectedDay);

export default handler;
