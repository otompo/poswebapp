import nc from 'next-connect';
import { getTotalUsersInActive } from '../../../../../backend/controllers/userController';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getTotalUsersInActive);

export default handler;
