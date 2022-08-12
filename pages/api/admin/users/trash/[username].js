import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import {
  moveUserFromTrash,
  moveUserToTrash,
} from '../../../../../backend/controllers/userController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).put(moveUserToTrash);
handler.use(isAuth, isAdmin).patch(moveUserFromTrash);

export default handler;
