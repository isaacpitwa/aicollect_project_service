import express from 'express';
import usersRouter from './usersRoute';
import profileRouter from './profileRoute';

const router = express.Router();

router.use('/authService', usersRouter);
router.use('/profiles', profileRouter);

router.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({
      status: 400,
      errors: 'Server can\'t handle the request currently'
    });
  }
  console.log(err);
  return next(err);
});

export default router;
