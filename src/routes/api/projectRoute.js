import express from 'express';
import ProjectController from '../../controllers/projectController';
// import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/create')
  .post(ProjectController.createProject)
  .all(method);
router
  .route('/addTeamMember')
  .post(ProjectController.addMembersToProject)
  .all(method);
router
  .route('/projects')
  .get(ProjectController.getProjects)
  .all(method);
router
  .route('/projects/:id')
  .get(ProjectController.getProjectDetails)
  .all(method);

export default router;
