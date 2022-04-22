import express from 'express';
import projectRouter from './projectRoute';
import formRouter from './formRoute';
import taskRouter from './taskRoute';

const router = express.Router();

// Register Routes to app
router.use('/projectService', projectRouter);
router.use('/forms', formRouter);
router.use('/tasks', taskRouter);

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
