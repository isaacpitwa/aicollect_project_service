import mongooseModels from '../../database/models';
import Response from '../utils/response';

/** class representing FormController */
class FormController {
  /**
   * Creates a new Questionaire form
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create new Form Endpoint
   */
  static async createForm(req, res, next) {
    try {
      const form = req.body;
      const { formModel } = mongooseModels;
      const newForm = formModel({ ...form });
      newForm.save((error, saved) => {
        if (error) {
          // console.log(error);
          return Response.badRequestError(res, 'Something went wrong');
        }
        return Response.customResponse(res, 201, 'Form created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Retrieve all the Forms
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Function
   * @returns {object} Response from get All Forms Endpoint
   */
  static async getForms(req, res, next) {
    try {
      const { formModel } = mongooseModels;
      const forms = await formModel.find().exec();
      return Response.customResponse(res, 200, 'Forms retreived successfully', forms);
    } catch (error) {
      return next(error);
    }
  }
}

export default FormController;
