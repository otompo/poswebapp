import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { updateUserPassword } from '../../../../backend/controllers/userController';
import onError from '../../../../backend/utils/errors';
import { isAuth } from '../../../../backend/middlewares';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth).put(updateUserPassword);
// export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };
export default handler;
