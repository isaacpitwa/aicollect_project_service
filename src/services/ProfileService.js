/* eslint-disable no-useless-catch */
import { Profile } from '../../database/models';

/** Class representing the ProfileService */
class ProfileService {
  /**
   * Helper service to create a new user profile
   * @param {object} profile User Profile
   * @returns {object} Returns the Created Profile
   */
  static async createUserProfile(profile) {
    try {
      const newProfile = await Profile.create(profile);
      return newProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper service to fetch User Profiles
   * @returns {array} Returns List of User Profiles
   */
  static async getUserProfiles() {
    try {
      const profiles = await Profile.findAll();
      return profiles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper Service to find a profile by ID
   * @param {integer} profileId Profile Id to be checked Against
   * @returns {object} Return Profile of provided Id if found
   */
  static async findProfileById(profileId) {
    try {
      const profile = await Profile.findOne({ where: { id: profileId } });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Helper service to find Profile with userId
   * This helps to prevent user from having more than one Profile
   * @param {number} userId UserId to check against
   * @returns {object} Returns Profile with provided userId if found
   */
  static async findProfileByUserId(userId) {
    try {
      const profile = await Profile.findOne({ where: { UserId: userId } });
      return profile;
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileService;
