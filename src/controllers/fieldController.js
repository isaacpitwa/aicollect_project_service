import mongooseModels from '../database/models';
import Response from '../utils/response';

/** class representing FormController */
class FieldController {
  /**
   * Creates a new Questionaire form
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from create new Form Endpoint
   */
  static async createFieldForm(req, res, next) {
    try {
      const form = req.body;
      const { fieldModel } = mongooseModels;
      const newForm = new fieldModel({ ...form });
      newForm.save((error, saved) => {
        if (error) {
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
  static async updateFieldForm(req, res, next) {
    try {
      const { fieldModel } = mongooseModels;
      req.body.updatedAt = Date.now();
      const updateForm = await fieldModel.findOneAndUpdate({
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
  static async getFieldForms(req, res, next) {
    try {
      const { fieldModel } = mongooseModels;
      const forms = await fieldModel.find().exec();
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
  static async getUserFieldForms(req, res, next) {
    try {
      const { fieldModel } = mongooseModels;
      const { clientId, projectId } = req.body;
      if (!clientId || !projectId) {
        return Response.badRequestError(res, 'Client Id or ProjectId was not provided');
      }
      const forms = await fieldModel.find({ clientId, projectId }).exec();
      return Response.customResponse(res, 200, 'Forms retreived successfully', forms);
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
  static async getFieldFormDetails(req, res, next) {
    try {
      const { fieldModel } = mongooseModels;
      const { fieldFormId } = req.params;
      const form = await fieldModel.findOne({ _id: fieldFormId }).exec();
      return Response.customResponse(res, 200, 'Forms retreived successfully', form);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Gets User Responses
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {Function} next Express Next Function
   * @returns {object} Response from get responses
   */
  static async getFieldFormResponses(req, res, next) {
    try {
      const { fieldFormId } = req.params;
      const { fieldResponseModel } = mongooseModels;
      const { roles, id, } = req.user;
      let responses = [];
      responses = await fieldResponseModel.find({ fieldForm: fieldFormId }).exec();
      if (roles === 'Supervisor') {
        responses = await fieldResponseModel.find({ fieldForm: fieldFormId, 'submittedBy.supervisor': id }).exec();
      }
      return Response.customResponse(res, 200, 'Responses retreived', responses).exec();
    } catch (error) {
      return next(error);
    }
  }
}

export default FieldController;
