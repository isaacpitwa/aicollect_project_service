/* eslint-disable no-useless-catch */

import Authconnector from "../utils/connector";

/** Class representing User services */
class UserService {
  /**
   * Get user by email if exists
   * @param {string} param email to be checked against
   * @returns {object} object of user if found
   */
  static async findUser(token) {
    try {
      const response = await Authconnector.get(`/check-user`,{
        headers: {
          Authorization: `Bearer ${token}` 
        }
       });
       if(response.data.status === 200){
          return response.data.data;
       }
      return null;
    } catch (error) {
      console.log("Find User ERROR: ", error);
      return null;
      // throw error;
    }
  }
}

export default UserService;
