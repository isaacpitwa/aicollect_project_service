import express from 'express';
import ProfileController from '../../controllers/profileController';
// import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/')
  .get(ProfileController.getProfiles)
  .all(method);
router
  .route('/create-profile')
  .post(ProfileController.createUserProfile)
  .all(method);

export default router;
