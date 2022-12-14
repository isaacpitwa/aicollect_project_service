import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';

const { fieldResponseModel } = mongooseModels;

/** class representing response controller functions */
class FieldResponseController {
  /**
   * @description Creates a new response
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create response
   */
  static async createfieldResponse(req, res, next) {
    try {
      // TODO: FORMAT USER RESPONSE AND UPLOAD IMAGES TO CLOUDINARY
      // UPLOAD PRESET ==> aicollect_field_responses
      const response = new fieldResponseModel({
        _id: mongoose.Types.ObjectId(),
        ...req.body
      });
      response.save((err, saved) => {
        if (err) {
          return Response.badRequestError(res, 'Please check that all the fields are right');
        }
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
      const { fieldFormId } = req.params;
      // const { roles, id, } = req.user;
      let responses = [];
      responses = await fieldResponseModel.find({ form: fieldFormId });
      // if (roles === 'Supervisor') {
      //   responses = await responseModel.find({ form: formId, submittedBy: { supervisor: id } });
      // }
      return Response.customResponse(res, 200, 'Responses retreived', responses);
    } catch (error) {
      return next(error);
    }
  }
}

export default FieldResponseController;
