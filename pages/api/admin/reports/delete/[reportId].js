import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { deleteReport } from '../../../../../backend/controllers/reportController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).delete(deleteReport);

export default handler;
