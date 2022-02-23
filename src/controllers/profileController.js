import UserService from '../services/UserService';
import ProfileService from '../services/ProfileService';
import Response from '../utils/response';

/** Class representing Profile Controller */
class ProfileController {
  /**
   * Create new user profile
   * This is what distinguises each user to
   * either be a client or a nomal user under a client
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {*} next Express next function
   * @returns {object} Response from the create profile endpoint
   */
  static async createUserProfile(req, res, next) {
    try {
      const rawData = req.body;
      const userExists = await UserService.findUserById(rawData.userId);
      if (!userExists) {
        return Response.notFoundError(res, 'User with provided Id does not exist');
      }
      // Check if user already has profile
      const userHasProfile = await ProfileService.findProfileByUserId(rawData.userId);
      if (userHasProfile) {
        return Response.conflictError(res, 'The Provided user already has an active profile');
      }
      const data = await ProfileService.createUserProfile(rawData);
      return Response.customResponse(res, 201, 'User Profile created successfully', data);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Fetch all user profiles
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {*} next Express next function
   * @returns {object} Response from the get profiles endpoint
   */
  static async getProfiles(req, res, next) {
    try {
      const profiles = await ProfileService.getUserProfiles();
      return Response.customResponse(res, 200, 'Profiles successfully retrieved', profiles);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProfileController;
