import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      contactNum: user.contactNum,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15d',
    },
  );
};

export { signToken };
