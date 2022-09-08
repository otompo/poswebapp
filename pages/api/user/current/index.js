import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuth } from '../../../../backend/middlewares';
import { currentUser } from '../../../../backend/controllers/authController';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(currentUser);

export default handler;
