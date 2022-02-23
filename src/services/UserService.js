/* eslint-disable no-useless-catch */
import database from '../../database/models';

const { User } = database;

/** Class representing User services */
class UserService {
  /**
   * Get All users
   * @returns {object} List of users
   */
  static async getUsers() {
    try {
      const usersList = await User.findAll();
      return usersList;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new user
   * @param {object} user
   * @returns {object} New user object
   */
  static async createUser(user) {
    try {
      // console.log('USER PASSED TO SEQ: ', user);
      const createdUser = await User.create(user);
      return createdUser;
    } catch (error) {
      console.log('CAN NOT CREATE RECORD \n', error);
      throw error;
    }
  }

  /**
   * Get user by email if exists
   * @param {string} param email to be checked against
   * @returns {object} object of user if found
   */
  static async findUserByEmail(param) {
    try {
      const user = await User.findOne({ where: param });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by id if exists
   * @param {number} param User Id to be checked against
   * @returns {object} object of user if found
   */
  static async findUserById(param) {
    try {
      const user = await User.findOne({ where: param });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by phone if exists
   * @param {string} param phone to be checked against
   * @returns {object} object of user if found
   */
  static async findUserByPhone(param) {
    try {
      const user = await User.findOne({ where: param });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a user if found
   * @param {string} param Parameters to be checked against
   * @param {object} user User to be updated
   * @returns {object} Updated user if found
   */
  static async updateUser(param, user) {
    try {
      const updatedUser = await User.update(user, {
        returning: true,
        where: [param]
      });
      return updatedUser;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }

  /**
   * Deletes a user record from the database
   * @param {number} userId ID of User to be deleted
   * @returns {object} Deleted User
   */
  static async deleteUser(userId) {
    try {
      const userToBeDeleted = await User.destroy({ where: { id: userId } });
      return userToBeDeleted;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
