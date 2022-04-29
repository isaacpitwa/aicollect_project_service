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
  .route('/projects/create')
  .post(verify, ProjectController.createProject)
  .all(method);
router
  .route('/projects/addTeamMember')
  .post(verify, ProjectController.addMembersToProject)
  .all(method);
router
  .route('/projects')
  .get(verify, ProjectController.getProjects)
  .all(method);
router
  .route('/projects/userProjects')
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
  .route('/tasks/create')
  .post(TaskController.createTask)
  .all(method);
router
  .route('/tasks/user')
  .post(TaskController.getUserTasks)
  .all(method);
router
  .route('/tasks/project')
  .post(TaskController.getProjectTasks)
  .all(method);
router
  .route('/tasks/:taskId')
  .get(TaskController.getTaskDetails)
  .all(method);

/** FORM / RESPONSE ROUTES */
router
  .route('/forms')
  .get(verify, FormController.getForms)
  .all(method);
router
  .route('/forms/getClientForms')
  .post(verify, FormController.getUserForms)
  .all(method);
router
  .route('/forms/getModuleForms')
  .post(verify, FormController.getUserFormsForSpecificModule)
  .all(method);
router
  .route('/forms/update')
  .post(verify, FormController.updateForm)
  .all(method);
router
  .route('/forms/:formId')
  .get(verify, FormController.getFormDetails)
  .all(method);
router
  .route('/forms/create/newForm')
  .post(verify, FormController.createForm)
  .all(method);
router
  .route('/forms/submit/new-response')
  .post(verify, ResponseController.createResponse)
  .all(method);

export default router;
