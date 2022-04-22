import express from 'express';
import TaskController from '../../controllers/taskController';
// import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/')
  .get(TaskController.getTasks)
  .all(method);
router
  .route('/create')
  .post(TaskController.createTask)
  .all(method);
router
  .route('/user')
  .post(TaskController.getUserTasks)
  .all(method);
router
  .route('/project')
  .post(TaskController.getProjectTasks)
  .all(method);
router
  .route('/:taskId')
  .get(TaskController.getTaskDetails)
  .all(method);

export default router;
