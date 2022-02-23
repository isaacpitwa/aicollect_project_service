import otpGenerator from 'otp-generator';

import { OTP } from '../../database/models';
import AddMinutesToDate from '../utils/addMinutesToDate';
import Emails from '../utils/mail/email';
import OTPEmail from '../utils/mail/otp.email';
// import VerifyEmail from '../utils/mail/verify.email';
import Response from '../utils/response';
import { encrypt } from '../utils/encrypt';
import UserService from '../services/UserService';

/** class representing the OTP Controller */
class OtpController {
  /**
   * Sends OTP to user email
   * @param {object} req Express Request
   * @param {objext} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from Send OTP to email endpoint
   */
  static async sendOTPEmail(req, res, next) {
    try {
      const { phone } = req.body;
      if (!phone) {
        return Response.badRequestError(res, 'Phone number was not provided');
      }
      const userExists = await UserService.findUserByPhone({ phone });
      if (!userExists) {
        return Response.notFoundError(res, 'Sorry, your phone number is not registered yet, contact support');
      }
      // Generate OTP
      const otp = otpGenerator.generate(
        6,
        { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }
      );
      const now = new Date();
      const expirationTime = AddMinutesToDate(now, 10);

      // Create OTP instance in DB
      const otpInstance = await OTP.create({ otp, expiration_time: expirationTime });
      const details = {
        timestamp: now,
        check: userExists.email,
        success: true,
        message: 'OTP sent to user',
        otp_id: otpInstance.id
      };
      // Encrypt the OTP
      const encoded = await encrypt(JSON.stringify(details));

      // TODO: Choose message template to use
      let otpSent;
      try {
        const header = Emails.header({ to: userExists.email, subject: 'AiCollect OTP Code' });
        const msg = OTPEmail.otpEMailTemplate(otp);
        // eslint-disable-next-line no-unused-vars
        const response = await Emails.sendmail({ ...header, ...msg });
        otpSent = 'OTP successfully sent';
      } catch (error) {
        otpSent = 'OTP could not be delivered';
      }
      return Response.customResponse(res, 200, 'OTP Generated successfully', { message: otpSent, details: encoded });
    } catch (error) {
      return next(error);
    }
  }
}

export default OtpController;
