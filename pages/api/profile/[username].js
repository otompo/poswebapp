import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { readSingleUser } from '../../../backend/controllers/userController';
import { isAuth, isAdmin } from '../../../backend/middlewares';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(readSingleUser);

export default handler;
