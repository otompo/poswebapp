import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../../backend/middlewares';
import { getAllUsersInTrash } from '../../../../../backend/controllers/userController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getAllUsersInTrash);

export default handler;
