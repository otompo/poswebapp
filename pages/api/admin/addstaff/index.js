import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { addStaff } from '../../../../backend/controllers/adminController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(addStaff);

export default handler;
