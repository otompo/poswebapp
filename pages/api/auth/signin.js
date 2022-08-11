import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { signin } from '../../../backend/controllers/authController';
import onError from '../../../backend/utils/errors';

const handler = nc({ onError });

dbConnect();

handler.post(signin);

export default handler;
