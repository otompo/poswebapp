import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuth } from '../../../../backend/middlewares';
import { updatePassword } from '../../../../backend/controllers/authController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth).put(updatePassword);
// export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };
export default handler;
