import express from 'express';
import projectRouter from './projectRoute';
import formRouter from './formRoute';

const router = express.Router();

router.use('/projectService', projectRouter);
router.use('/forms', formRouter);

router.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({
      status: 400,
      errors: 'Server can\'t handle the request currently'
    });
  }
  return next(err);
});

export default router;
