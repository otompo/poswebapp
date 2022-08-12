import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import {
  makeUserAdmin,
  removeAsAdmin,
} from '../../../../../backend/controllers/userController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).put(makeUserAdmin);
handler.use(isAuth, isAdmin).patch(removeAsAdmin);

export default handler;
