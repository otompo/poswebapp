import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import { removeUser } from '../../../../backend/controllers/userController';
import { removeUserAsAdmin } from '../../../../backend/controllers/adminController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).put(removeUserAsAdmin);
handler.use(isAuth, isAdmin).delete(removeUser);

export default handler;
