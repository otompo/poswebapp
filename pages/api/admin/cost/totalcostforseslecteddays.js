import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getTotalCostAmount } from '../../../../backend/controllers/costController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuth, isAdmin).get(getTotalCostAmount);

export default handler;
