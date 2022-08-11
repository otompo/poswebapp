import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { createCompanyDetails } from '../../../../backend/controllers/settingsController';
import { isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuth, isAdmin).post(createCompanyDetails);

export default handler;
