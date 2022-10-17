import SessionManager from '../utils/sessionManager';
import Response from '../utils/response';
import UserService from '../services/UserService';

const verify = async (req, res, next) => {
  try {
    // Get token from headers sent by client
    const token = req.headers.authorization.split(' ')[1];
    // Decode the token
    const payload = await SessionManager.decodeToken({ token });
    // console.log('DEBUG', payload);
    // Check redis server for key with email
    const result = await SessionManager.verifyToken(payload.email);
    if (result === null) return Response.authenticationError(res, 'User not logged in');
    const { email } = payload;
    // Check for updated user role from DB and not from token;
    const user = await UserService.findUser(token);
    // payload.roles = roles;
    req.user = user;
    next();
  } catch (error) {
    return Response.authenticationError(res, 'Invalid or expired token used');
  }
};

export default verify;
