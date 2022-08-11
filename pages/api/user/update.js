import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import onError from '../../../backend/utils/errors';
import { isAuth } from '../../../backend/middlewares';
import { updateUserProfile } from '../../../backend/controllers/userController';

const handler = nc({ onError });
dbConnect();
handler.use(isAuth).put(updateUserProfile);

export default handler;
