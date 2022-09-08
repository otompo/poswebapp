import nc from 'next-connect';
import { currentAdmin } from '../../../../backend/controllers/adminController';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuth } from '../../../../backend/middlewares';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(currentAdmin);

export default handler;
