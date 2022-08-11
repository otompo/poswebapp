import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import { makeUserAdmin } from '../../../../../backend/controllers/userController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).put(makeUserAdmin);

export default handler;
