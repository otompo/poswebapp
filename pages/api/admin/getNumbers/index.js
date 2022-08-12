import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getNumbers } from '../../../../backend/controllers/adminController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getNumbers);

export default handler;
