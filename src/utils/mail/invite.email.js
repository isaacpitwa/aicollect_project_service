import dotenv from 'dotenv';

dotenv.config();

/** @class VerifyEmail */
class InviteEmail {
  /**
   * Generates Invitation email template
   * @param {string} url Verify link
   * @param {string} email User email
   * @returns {string} Verify email template
   */
  static verificationLinkTemplate(url, email) {
    const html = `<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="900px" style="padding: 0 40px 0 40px; background-color:#f1f2f3;">
      <tr><td align="center" style="background-color:#f9fcff; margin: 0 50px 0 50px;">
      <a><img src="https://res.cloudinary.com/stuartdambi/image/upload/v1644821414/samples/logo_nw8fp7.png" alt="AiCollect"width="120" height="100" style="display: block;></a></td>
     </tr><tr><td align = "center" style="padding: 0 50px 0 50px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; padding: 0 0 0 20px;">
          <tr><td align="center" style="font-family: Arial, sans-serif; font-size: 24px; color: #050505;"> <p>Hi ${email},</p>
            </td></tr> <tr><td align="center" style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
              <p>You have been invited to AiCollect</p></td></tr> <tr><td align="center">
              <a style="width:250px; display:inline-block; text-decoration: none; font-size: 15px;text-align: center;
              background-color:#55acee;border-radius:2px;color:white;height:32px; cursor: pointer; padding-top:5px" href=${url}>Accept Invitation</a>
            </td></tr><tr><td align="center" style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;"><p>this link will expire after 1 hour.</p>
              <p>contact <a href=#>info@rocksideconsults.com</a> if you didnt intiate this request</p><p>Thank you for using AiCollect</p></td></tr></table></td></tr><tr><td align="center" style="padding: 30px 30px 30px 30px;">
          &reg; AiCollect, 2022<br/></td></tr></table></body>`;
    return { html };
  }
}

export default InviteEmail;
