import mongoose from 'mongoose';
import mongooseModels from '../../database/models';
import Response from '../utils/response';

const { responseModel } = mongooseModels;

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
      const response = new responseModel({
        _id: mongoose.Types.ObjectId(),
        ...req.body
      });
      response.save((err, saved) => {
        if (err) {
          console.log(err);
          return Response.badRequestError(res, 'Please check that all the fields are right');
        }
        return Response.customResponse(res, 201, 'Response submited successfully', saved);
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ResponseController;
