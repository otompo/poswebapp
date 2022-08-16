import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getSalesForaParticulardate } from '../../../../backend/controllers/salesController';
import { isAuth, isAdmin } from '../../../../backend/middlewares';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getSalesForaParticulardate);

export default handler;
