/* eslint-disable no-useless-catch */
import database from '../../database/models';

const { Session } = database;

/** class representing session servies */
class SessionService {
  /**
   * Creates a new user session
   * @param {object} session the session to be created
   * @returns {object} The new Session
   */
  static async createSession(session) {
    try {
      const newSession = await Session.create(session);
      return newSession;
    } catch (error) {
      // console.error('LOGGER --> ', error);
      throw error;
    }
  }

  /**
   * Deletes a user session
   * @param {number} sessionId Id of session to be Deleted
   * @returns {object} Deleted Session
   */
  static async deleteSession(sessionId) {
    try {
      const sessionToBeDeleted = await Session.destroy({ where: { id: sessionId } });
      return sessionToBeDeleted;
    } catch (error) {
      throw error;
    }
  }
}

export default SessionService;
