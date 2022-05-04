import Joi from 'joi';
import validator from '../utils/validator';

/** Project Validation class */
export default class ProjectValidator {
  /**
   * Validates details of project
   * @param {object} req Express Request
   * @param {object} res Express Response body
   * @param {*} next Express Next Function
   * @returns {object} returns a validation of user raw data from endpoint
   */
  static async validateProject(req, res, next) {
    const projectMember = Joi.object().keys({
      userId: Joi.number().required(),
      roles: Joi.string().required(),
      name: Joi.string().required(),
      createdAt: Joi.date().required(),
      createdBy: Joi.object().keys({
        userId: Joi.number().required(),
        roles: Joi.string().required(),
        name: Joi.string().required()
      }).required()
    });
    const schema = Joi.object().keys({
      projectname: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
      createdBy: Joi.object().keys({
        userId: Joi.number()
          .required(),
        name: Joi.string()
          .required(),
        roles: Joi.string()
          .required()
      }).required(),
      isDeleted: Joi.boolean(),
      projectTeam: Joi.array()
        .items(projectMember),
      projectOwner: Joi.number().required(),
    });
    validator(schema, req.body, res, next);
  }
}
