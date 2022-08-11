import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { updatePassword } from '../../../../backend/controllers/userController';
import onError from '../../../../backend/utils/errors';
import { isAuth } from '../../../../backend/middlewares';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth).patch(updatePassword);
export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };
export default handler;
