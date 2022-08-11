import jwt from 'jsonwebtoken';

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

const isAdmin = async (req, res, next) => {
  if (req.user.role.includes('admin')) {
    next();
  } else {
    res.status(401).send({ message: 'Access denied' });
  }
};

export { isAuth, isAdmin };
