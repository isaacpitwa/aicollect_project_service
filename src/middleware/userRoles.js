import Response from '../utils/response';

/** Class representing Access */
class Access {
  /**
   * Middleware function to Check user roles
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} User Object
   */
  static async accessToEditAndCreateUsers(req, res, next) {
    const { roles } = req.user;
    const allowedRoles = ['Owner', 'Admin', 'Data Manager'];
    if (allowedRoles.includes(roles) === false) {
      return Response.authorizationError(res, 'You are not allowed to perform this task');
    }
    next();
  }
}

export default Access;
