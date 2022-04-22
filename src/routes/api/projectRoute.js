import express from 'express';
import ProjectController from '../../controllers/projectController';
import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/create')
  .post(verify, ProjectController.createProject)
  .all(method);
router
  .route('/addTeamMember')
  .post(verify, ProjectController.addMembersToProject)
  .all(method);
router
  .route('/projects')
  .get(verify, ProjectController.getProjects)
  .all(method);
router
  .route('/userProjects')
  .post(verify, ProjectController.getUserProjects)
  .all(method);
router
  .route('/projects/update')
  .post(verify, ProjectController.updateProject)
  .all(method);
router
  .route('/projects/:id')
  .get(verify, ProjectController.getProjectDetails)
  .all(method);

export default router;
