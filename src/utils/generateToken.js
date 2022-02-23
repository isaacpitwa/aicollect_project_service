import jwt from 'jsonwebtoken';

const generateToken = (data) => {
  const token = jwt.sign(
    {
      email: data.email,
      roles: data.roles,
      expiryDate: data.expiryDate
    },
    process.env.JWT_SECRET
  );
  return token;
};

export default generateToken;
