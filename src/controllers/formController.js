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
      console.log(req.body);
      const { formModel } = mongooseModels;
      const newForm = new formModel({ ...form });
      newForm.save((error, saved) => {
        if (error) {
          console.log(error);
          return Response.badRequestError(res, 'Something went wrong');
        }
        return Response.customResponse(res, 201, 'Form created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Creates a new Questionaire form
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create new Form Endpoint
   */
  static async updateForm(req, res, next) {
    try {
      const { formModel } = mongooseModels;
      const updateForm = await formModel.findOneAndUpdate({
        _id: req.body.formId
      }, req.body, { new: true });
      return Response.customResponse(res, 200, 'Form Updated successfully', updateForm);
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

  /**
   * @description Retrieve all single user's Forms
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Function
   * @returns {object} Response from get All Forms Endpoint
   */
  static async getUserForms(req, res, next) {
    try {
      const { formModel } = mongooseModels;
      const { clientId, projectId } = req.body;
      if (!clientId || !projectId) {
        return Response.badRequestError(res, 'Client Id or ProjectId was not provided');
      }
      const forms = await formModel.find({ clientId, projectId }).exec();
      return Response.customResponse(res, 200, 'Forms retreived successfully', forms);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Retrieve all single user's Forms for specific module
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Function
   * @returns {object} Response from get All Forms Endpoint
   */
  static async getUserFormsForSpecificModule(req, res, next) {
    try {
      const { formModel } = mongooseModels;
      const { clientId, projectId, module } = req.body;
      console.log(req.body);
      if (!clientId) {
        return Response.badRequestError(res, 'CliendId was not provided');
      }
      if (!projectId) {
        return Response.badRequestError(res, 'projectId was not provided');
      }
      if (!module) {
        return Response.badRequestError(res, 'Module name was not provided');
      }
      const forms = await formModel.find({ clientId, projectId, module }).exec();
      return Response.customResponse(res, 200, 'Module Forms retreived successfully', forms);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Retrieve Details of a Forms
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Function
   * @returns {object} Response from get Form Details Endpoint
   */
  static async getFormDetails(req, res, next) {
    try {
      const { formModel } = mongooseModels;
      const { formId } = req.params;
      const form = await formModel.findOne({ _id: formId }).exec();
      return Response.customResponse(res, 200, 'Form Details retrieved successfully', form);
    } catch (error) {
      return next(error);
    }
  }
}

export default FormController;
