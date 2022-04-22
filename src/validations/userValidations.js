import Joi from '@hapi/joi';
import Schema from './schema';
import validator from '../utils/validator';

/** User Validation class */
export default class UserValidator {
  /**
   * Validates details of user at signup
   * @param {object} req Express Request
   * @param {object} res Express Response body
   * @param {*} next Express Next Function
   * @returns {object} returns a validation of user raw data from endpoint
   */
  static async validateSignup(req, res, next) {
    const schema = Joi.object().keys({
      firstname: Schema.firstname,
      lastname: Schema.lastname,
      roles: Schema.roles,
      email: Schema.email,
      phone: Schema.phone,
      firstTimeProcessor: Schema.firstTimeProcessor,
      processor: Schema.processor,
      isActive: Schema.isActive,
      isDeleted: Schema.isDeleted,
      addedBy: Schema.addedBy
    });
    validator(schema, req.body, res, next);
  }

  /**
   * Validates details of user at signin
   * @param {object} req Express Request
   * @param {object} res Express Response body
   * @param {*} next Express Next Function
   * @returns {object} returns a validation of user raw data from endpoint
   */
  static async validateSignin(req, res, next) {
    const schema = Joi.object().keys({
      email: Joi.string()
        .required()
        .email()
        .error(() => 'Email is required'),
      password: Joi.string()
        .required()
        .error(() => 'Password is required')
    });
    validator(schema, req.body, res, next);
  }
}
