/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import redis from 'redis';
import { promisify } from 'util';

const host = 'localhost';
const port = 6379;
const redisClient = redis.createClient(port, host);

const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

redisClient
  .on('connect', () => {
    console.log('Redis connected');
  })
  .on('error', (error) => {
    console.log('Something went wrong');
    console.log(error);
  });

/** Class representing the session manager */
class SessionManager {
  /**
   * Checks of token is true
   * @param {string} email user email
   * @returns {string} JWT token
   */
  static async verifyToken(email) {
    const result = await getAsync(email);
    return result;
  }

  /**
   * Decodes JWT Token
   * @param {object} data User details
   * @returns {function} JWT Verify function
   */
  static decodeToken(data) {
    // eslint-disable-next-line no-useless-catch
    try {
      return jwt.verify(data.token, process.env.JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Destroys a token
   * @param {object} user User details
   * @returns {string} token
   */
  static async destroyToken(user) {
    const result = await delAsync(user.email);
    return result;
  }

  /**
   * Utility function to verify token from user email
   * @param {string} token User token
   * @returns {object} User details from token
   */
  static verifyTokenFromEmailVerification(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default SessionManager;
