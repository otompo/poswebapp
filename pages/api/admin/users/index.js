import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuth, isAdmin } from '../../../../backend/middlewares';
import { getAllUsers } from '../../../../backend/controllers/userController';
import { addStaff } from '../../../../backend/controllers/adminController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(addStaff);
handler.use(isAuth, isAdmin).get(getAllUsers);

export default handler;
