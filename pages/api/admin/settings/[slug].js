import nc from 'next-connect';
import { getAllDetails } from '../../../../backend/controllers/settingsController';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
// import { isAuth } from '../../../../backend/middlewares';

const handler = nc({ onError });

dbConnect();

handler.get(getAllDetails);

export default handler;
