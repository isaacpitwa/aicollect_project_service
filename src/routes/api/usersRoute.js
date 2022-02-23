import express from 'express';
import passport from 'passport';
import UserController from '../../controllers/userController';
import OtpController from '../../controllers/OTPController';
import '../../config/passport';
// import UserValidator from '../../validations/userValidations';
import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

// router
//   .route('/signup')
//   .post(UserValidator.validateSignup, UserController.registerUser)
//   .all(method);
router
  .route('/signup')
  .post(UserController.registerUser)
  .all(method);
router
  .route('/verifyEmail')
  .post(UserController.verifyUserEmail)
  .all(method);
router
  .route('/create_user')
  .post(verify, UserController.createClientUsers)
  .all(method);
router
  .route('/complete-profile')
  .post(UserController.completeUserEmailAfterInvitation)
  .all(method);
router
  .route('/send_invitation')
  .post(UserController.inviteUser)
  .all(method);
router
  .route('/login')
  .post(UserController.loginUser)
  .all(method);
router
  .route('/users')
  .get(verify, UserController.getAllUsers)
  .all(method);
router
  .route('/users/:userId')
  .get(verify, UserController.getUserDetails)
  .all(method);
router
  .route('/update')
  .post(verify, UserController.updateUser)
  .all(method);
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  })
);
router.get('/google/redirect', passport.authenticate('google'), UserController.socialLogin);
router
  .route('/check-user')
  .get(verify, UserController.checkToken)
  .all(method);
router
  .route('/delete-user')
  .post(verify, UserController.deleteUser)
  .all(method);
router
  .route('/sendOtp')
  .post(OtpController.sendOTPEmail)
  .all(method);

export default router;
