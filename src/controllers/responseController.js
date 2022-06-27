/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';

const { responseModel, fieldResponseModel } = mongooseModels;

/** class representing response controller functions */
class ResponseController {
  /**
   * @description Creates a new response
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create response
   */
  static async createResponse(req, res, next) {
    try {
      // TODO: FORMAT USER RESPONSE AND UPLOAD IMAGES TO CLOUDINARY
      // UPLOAD PRESET ==> aicollect_field_responses
      const fields = [...req.body.fields];
      delete req.body.fields;
      const response = new responseModel({
        _id: mongoose.Types.ObjectId(),
        ...req.body
      });
      response.save((err, saved) => {
        if (err) {
          return Response.badRequestError(res, 'Please check that all the fields are right');
        }
        fields.map((field) => {
          fieldResponseModel
            .findOne({ region: field.region })
            .sort('-prefix_id') // give me the max
            .exec((err, response) => {
              const newField = new fieldResponseModel({
                _id: mongoose.Types.ObjectId(),
                ...field,
                response: saved._id,
                prefix_id: response ? response.prefix_id + 1 : 0,
              });
              newField.save((err, savedField) => {
                if (err) {
                  return Response.badRequestError(res, 'Please check that all the form Field fields are right');
                }
              });
            });
        });
        return Response.customResponse(res, 201, 'Response submited successfully', saved);
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Gets User Responses
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from get responses
   */
  static async getUserResponses(req, res, next) {
    try {
      const { formId } = req.params;
      const { roles, id, } = req.user;
      let responses = [];
      responses = await responseModel.find({ form: formId }).exec();
      if (roles === 'Supervisor') {
        responses = await responseModel.find({ form: formId, 'submittedBy.supervisor': id }).exec();
      }
      return Response.customResponse(res, 200, 'Responses retreived', responses);
    } catch (error) {
      return next(error);
    }
  }
}

export default ResponseController;
