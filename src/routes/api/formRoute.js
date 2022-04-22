import express from 'express';
import FormController from '../../controllers/formController';
import ResponseController from '../../controllers/responseController';
// import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/')
  .get(FormController.getForms)
  .all(method);
router
  .route('/getClientForms')
  .post(FormController.getUserForms)
  .all(method);
router
  .route('/getModuleForms')
  .post(FormController.getUserFormsForSpecificModule)
  .all(method);
router
  .route('/update')
  .post(FormController.updateForm)
  .all(method);
router
  .route('/:formId')
  .get(FormController.getFormDetails)
  .all(method);
router
  .route('/create/newForm')
  .post(FormController.createForm)
  .all(method);
router
  .route('/submit/new-response')
  .post(ResponseController.createResponse)
  .all(method);

export default router;
