import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'sfskftsfdssdsp3405059o53H530smdslf',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token is not valid' });
        } else {
          req.user = decode;
          next();
        }
      },
    );
  } else {
    res.status(401).send({ message: 'Token is not suppiled' });
  }
};

// const isAdmin = async (req, res, next) => {
//   if (req.user.role.includes('admin')) {
//     next();
//   } else {
//     res.status(401).send({ message: 'Access denied' });
//   }
// };

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.role.includes('admin')) {
      return res.status(403).send('Unauhorized');
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

export { isAuth, isAdmin };
