import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getSalesByUserLimit } from '../../../../backend/controllers/salesController';
import { isAuth } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth).get(getSalesByUserLimit);

export default handler;
