import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
// import generateToken from '../generateToken';

dotenv.config();

/** @class Emails */
class Emails {
  /**
   * Creates a Email Header
   * @param {Object} data object containing user details
   * @returns {string} customized url
   */
  static header(data) {
    const from = data.from || process.env.FROM_EMAIL;
    const { to } = data;
    const { subject } = data;
    return {
      from,
      to,
      subject
    };
  }

  /**
   * Creates a customized url
   * @param {Object} data object conatining url details
   * @returns {string} customized url
   */
  static emailUrl(data) {
    return `${process.env.FRONTEND_URL}/${data.endpoint}/${data.userId}/${data.token}`;
  }

  /**
   * Sends email using sendGrid
   * @param {object} message a message options
   * @returns {Promise} information about the sent email
   */
  static async sendmail(message) {
    let msg;
    sgMail.setApiKey(process.env.API_KEY);
    if (process.env.NODE_ENV === 'test') {
      msg = {
        ...message,
        mail_settings: {
          sandbox_mode: {
            enable: true
          }
        }
      };
    } else {
      msg = message;
    }
    // console.log('MESSAGE', msg);
    const result = await sgMail.send(msg);
    // console.log('RESULT', result);
    return result;
  }
}

export default Emails;
