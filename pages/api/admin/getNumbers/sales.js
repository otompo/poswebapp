import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getTotalSales } from '../../../../backend/controllers/statisticsController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getTotalSales);

export default handler;
