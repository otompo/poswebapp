import nc from 'next-connect';
import dbConnect from '../../../../../../backend/config/dbConnect';
import { getPurchaseProductsLimit } from '../../../../../../backend/controllers/purchaseController';

import { isAdmin, isAuth } from '../../../../../../backend/middlewares';

import onError from '../../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).get(getPurchaseProductsLimit);

export default handler;
