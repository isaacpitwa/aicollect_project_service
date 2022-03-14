import express from 'express';
import FormController from '../../controllers/formController';
// import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/')
  .get(FormController.getForms)
  .all(method);
router
  .route('/create')
  .post(FormController.createForm)
  .all(method);

export default router;
