import express from 'express';
import ProjectController from '../../controllers/projectController';
import TaskController from '../../controllers/taskController';
import FormController from '../../controllers/formController';
import ResponseController from '../../controllers/responseController';
import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

/** PROJECT ROUTES */
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

/** TASK ROUTES */
router
  .route('/tasks')
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

/** FORM / RESPONSE ROUTES */
router
  .route('/forms')
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
