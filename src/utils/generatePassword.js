import { hash, genSalt, compareSync } from 'bcryptjs';

/** Class representing the Password util */
class Password {
  /**
   * Generates a new password
   * @param {object} data User details
   */
  constructor(data) {
    this.password = data.password;
  }

  /**
   * Encrypts the Password
   * @returns {string} New Password
   */
  async encryptPassword() {
    const salt = await (0, genSalt)(10);
    const newPassword = await hash(this.password, salt);
    return newPassword;
  }

  /**
   * Checks if password provided matches with Hashed password
   * @param {string} password User password
   * @param {string} hashedPassword Password in the database
   * @returns {function} Function that compares hashed password
   */
  static async checkPasswordMatch(password, hashedPassword) {
    return compareSync(password, hashedPassword);
  }

  /**
   * Random password generator
   * @returns {string} Generated Password
   */
  static randomPassword() {
    const special = '!@#$%^&*()_+=<>';
    const randomNumber = Math.floor(Math.random() * special.length);
    const alphanumeric = Math.random()
      .toString(36)
      .substring(2, 8)
      + Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
    const password = alphanumeric.replace(alphanumeric[randomNumber], special[randomNumber]);
    return password;
  }
}

export default Password;
