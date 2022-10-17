/* eslint-disable no-useless-catch */

/** Class representing User services */
class UserService {
  /**
   * Get user by email if exists
   * @param {string} param email to be checked against
   * @returns {object} object of user if found
   */
  static async findUser(token) {
    try {
      const user = await fetch(`${process.env.API_URL}/check-user`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      return user;
    } catch (error) {
      console.log("Find User ERROR: ", error);
      return null;
      // throw error;
    }
  }
}

export default UserService;
