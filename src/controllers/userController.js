import dotenv from 'dotenv';
import UserService from '../services/UserService';
// import SessionService from '../services/SessionService';
import Password from '../utils/generatePassword';
import Emails from '../utils/mail/email';
import VerifyEmail from '../utils/mail/verify.email';
import Response from '../utils/response';
import generateToken from '../utils/generateToken';
import SessionManager from '../utils/sessionManager';
import InviteEmail from '../utils/mail/invite.email';

dotenv.config();

/** Class representing the UserController */
class UserController {
  /**
   * Registers a new user
   * @param {*} req details
   * @param {*} res details
   * @param {*} next details
   * @returns {object} registered user
   */
  static async registerUser(req, res, next) {
    const rawData = req.body;
    try {
      const userDetails = await UserService.findUserByEmail({
        email: rawData.email
      });
      // console.log('LOGGER -->', userDetails);
      if (userDetails) {
        return Response.conflictError(res, 'User Already Exists');
      }
      const checkForPhoneExists = await UserService.findUserByPhone({ phone: rawData.phone });

      if (checkForPhoneExists) {
        return Response.conflictError(res, 'Phone number was already used by someone');
      }
      // generate a hashed password
      const obj = new Password(rawData);
      const newPassword = await obj.encryptPassword();
      // console.log('LOGGER PASSWORD -->', newPassword);
      // Update raw data
      rawData.password = newPassword;

      // Upload user to database
      const data = await UserService.createUser(rawData);
      // console.log('LOGGER USER --> ', data);
      const token = await SessionManager.generateToken(data);
      const link = `${process.env.FRONTEND_URL}/authentication/verify-email/?token=${token}`;
      let verification;
      try {
        const header = Emails.header({ to: data.email, subject: 'AiCollect Email Verification Link' });
        const user = data.dataValues;
        delete user.password;
        const msg = VerifyEmail.verificationLinkTemplate(link, user);
        // eslint-disable-next-line no-unused-vars
        const response = await Emails.sendmail({ ...header, ...msg });
        // console.log('DEBUG --> ', response);
        verification = 'Verification link sent successfully';
      } catch (error) {
        verification = 'Verification link not sent';
      }
      return Response.customResponse(res, 201, 'Account has been created successfully', { ...data.dataValues, verification: { message: verification, link } });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Creates a new user by an Admin
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the create user Endpoint
   */
  static async createClientUsers(req, res, next) {
    const rawData = req.body;
    try {
      const userDetails = await UserService.findUserByEmail({ email: rawData.email });
      if (userDetails) {
        return Response.conflictError(res, 'User with email already exists');
      }
      const checkForPhoneExists = await UserService.findUserByPhone({ phone: rawData.phone });
      if (checkForPhoneExists) {
        return Response.conflictError(res, 'Phone number was already used by someone');
      }
      const obj = new Password(rawData);
      const newPassword = await obj.encryptPassword();
      rawData.password = newPassword;
      const data = await UserService.createUser(rawData);
      const token = await SessionManager.generateToken(data);
      return Response.customResponse(res, 201, 'Account has been created successfully', token);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Invites a new to the sytem through email
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the invite user Endpoint
   */
  static async inviteUser(req, res, next) {
    try {
      const { email, roles, expiryDate } = req.body;
      const userExists = await UserService.findUserByEmail({ email });
      if (userExists) {
        return Response.conflictError(res, `User with email ${email} already exists`);
      }
      const user = await UserService.createUser({
        email, roles, expiryDate, status: 'Pending'
      });
      const userToken = generateToken({ email, roles, expiryDate });
      const link = `${process.env.FRONTEND_URL}/authentication/complete-profile/?token=${userToken}`;
      let invitation;
      try {
        const header = Emails.header({ to: email, subject: 'Invitation to AiCollect' });
        // console.log('HEADER --> ', header);
        const msg = InviteEmail.verificationLinkTemplate(link, email);
        // console.log('MESSAGE --> ', msg);
        // eslint-disable-next-line no-unused-vars
        const response = await Emails.sendmail({ ...header, ...msg });
        invitation = 'Invitation email sent';
      } catch (error) {
        // console.log(error);
        invitation = 'Invitation email not sent';
      }
      return Response.customResponse(res, 200, 'User has been successfully invited', { user, invitation: { message: invitation, link } });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Completes user Registration after
   * invitation through email
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the invite user Endpoint
   */
  static async completeUserEmailAfterInvitation(req, res, next) {
    try {
      // console.log(req.body);
      const userDetails = SessionManager.decodeToken({ token: req.body.token });
      // console.log(userDetails);
      if (!userDetails) {
        return Response.notFoundError(res, 'Invitation could have expired, contact admin');
      }
      const obj = new Password(req.body);
      const newPassword = await obj.encryptPassword();
      req.body.password = newPassword;
      const {
        firstname, lastname, phone, password
      } = req.body;
      const data = await UserService.updateUser({ email: userDetails.email }, {
        firstname, lastname, phone, password, status: 'Active', emailVerified: true
      });
      // console.log(data[1][0].dataValues);
      const userToken = await SessionManager.generateToken(data[1][0].dataValues);
      return Response.customResponse(res, 201, 'Account has been created successfully', userToken);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Logs a user into the system
   * @param {*} req details
   * @param {object} res details
   * @param {*} next details
   * @returns {object} Response body after login
   */
  static async loginUser(req, res, next) {
    try {
      const { email, password, deviceToken } = req.body;
      const userExists = await UserService.findUserByEmail({ email });
      if (!userExists) {
        return Response.authenticationError(res, 'Invalid email or password');
      }
      const user = userExists;
      const match = await Password.checkPasswordMatch(password, user.password);
      if (!match) {
        return Response.authenticationError(res, 'Invalid email or password');
      }
      // Create Session for user
      user.deviceToken = deviceToken;
      user.token = await SessionManager.createRedisSession(user);
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      return Response.customResponse(res, 200, 'User logged in successfully', user.token);
    } catch (error) {
      // console.log(error);
      return next(error);
    }
  }

  /**
   * Get all users
   * @param {*} req details
   * @param {*} res details
   * @param {*} next details
   * @returns {object} List of users in DB
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      return Response.customResponse(res, 200, 'Users successfully retrieved', users);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get user details
   * @param {*} req details
   * @param {*} res details
   * @param {*} next details
   * @returns {object} User Details
   */
  static async getUserDetails(req, res, next) {
    try {
      const user = await UserService.findUserById({ id: req.params.userId });
      if (!user) {
        return Response.notFoundError(res, 'User with provided ID does not exist');
      }
      return Response.customResponse(res, 200, 'User retrieved successfully', user);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Handles Social login
   * @param {*} req details
   * @param {*} res details
   * @returns {object} .
   */
  static async socialLogin(req, res) {
    const { FRONTEND_URL } = process.env;
    const { firstname, lastname, email } = req.user;
    // const roles = '';
    let data;
    data = await UserService.findUserByEmail({ email });
    if (!data) {
      data = await UserService.createUser({
        email,
        firstname,
        lastname
      });
    }
    const token = await SessionManager.createRedisSession({
      id: data.id,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      roles: data.roles,
      emailVerified: true,
      profileImage: data.profileImage
    });
    const apiResponse = {
      status: 200,
      message: 'Successfully logged in',
      data: token
    };
    const responseBuffer = Buffer.from(JSON.stringify(apiResponse));
    return res.redirect(`${FRONTEND_URL}/login?code=${responseBuffer.toString('base64')}`);
  }

  /**
   * Updates a user
   * @param {*} req details
   * @param {*} res details
   * @param {*} next details
   * @returns {object} User update response
   */
  static async updateUser(req, res, next) {
    try {
      // console.log(req.user);
      const userExists = await UserService.findUserById({ id: req.body.userId });
      if (!userExists) {
        return Response.notFoundError(res, 'User with given ID does not exist');
      }
      const userUpdate = await UserService.updateUser({ id: req.body.userId }, req.body);
      return Response.customResponse(res, 200, 'User updated successfully', userUpdate);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Verify New user's email Address
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {*} next Express next function
   * @returns {object} Response from the create profile endpoint
   */
  static async verifyUserEmail(req, res, next) {
    try {
      const { token } = req.query;
      const { email } = SessionManager.verifyTokenFromEmailVerification(token);
      const user = await UserService.findUserByEmail({ email });
      if (user.emailVerified) {
        return Response.conflictError(res, 'Email is already verified');
      }
      // eslint-disable-next-line no-unused-vars
      const data = UserService.updateUser({ email }, { emailVerified: true, status: 'Active' });
      const userExists = user.dataValues;
      userExists.emailVerified = true;
      userExists.deviceToken = 'tokenIdOne';
      const userToken = await SessionManager.createRedisSession(userExists);
      return Response.customResponse(res, 201, 'Email verified successfully', { email, token: userToken });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get Currently logged in user Details
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {*} next Express next function
   * @returns {object} Response from the get logged in user endpoint
   */
  static async checkToken(req, res, next) {
    try {
      return Response.customResponse(res, 200, 'Current user', req.user);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Deletes user with provided ID
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {*} next Express next function
   * @returns {object} Response from the delete user endpoint
   */
  static async deleteUser(req, res, next) {
    try {
      const userExists = await UserService.findUserById({ id: req.body.id });
      if (!userExists) {
        return Response.notFoundError(res, 'User does not exist or was already deleted');
      }
      const data = await UserService.deleteUser(req.body.id);
      return Response.customResponse(res, 200, 'user deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;
