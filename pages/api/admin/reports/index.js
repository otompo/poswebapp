import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createReport,
  getAllReports,
} from '../../../../backend/controllers/reportController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(createReport);
handler.use(isAuth, isAdmin).get(getAllReports);

export default handler;
