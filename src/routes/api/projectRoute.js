import express from 'express';
import ProjectController from '../../controllers/projectController';
import TaskController from '../../controllers/taskController';
import FormController from '../../controllers/formController';
import ResponseController from '../../controllers/responseController';
import SectorController from '../../controllers/sectorController';

import verify from '../../middleware/auth';
// import ProjectValidator from '../../validations/projectValidations';
import method from '../../utils/method';
import Access from '../../middleware/userRoles';
import FieldController from '../../controllers/fieldController';

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
  .route('/user/projects')
  .post(verify, Access.accessToProjects, ProjectController.getUserProjects)
  .all(method);

router
  .route('/projects/deleteUser')
  .post(ProjectController.deleteUserFromProjects)
  .all(method);
router
  .route('/projects/update')
  .post(verify, ProjectController.updateProject)
  .all(method);
router
  .route('/projects/:id')
  .get(verify, ProjectController.getProjectDetails)
  .all(method);
router
  .route('/projects/:projectId')
  .delete(verify, ProjectController.deleteProject)
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
  .route('/forms/publish/:formId')
  .get(verify, FormController.publishForm)
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
  .route('/forms/templates/newTemplate')
  .post(verify, FormController.createQuestionaireTemplate)
  .all(method);
router
  .route('/forms/templates/:templateId')
  .delete(verify, FormController.deleteTemplate)
  .all(method);
router
  .route('/forms/templates/update')
  .post(verify, FormController.updateQuestionaireTemplate)
  .all(method);
router
  .route('/forms/responses/:formId')
  .get(verify, ResponseController.getUserResponses)
  .all(method);
router
  .route('/forms/submit/new-response')
  .post(verify, ResponseController.createResponse)
  .all(method);

// Field Registartion Forms
router
  .route('/fields/forms')
  .post(verify, FieldController.getUserFieldForms)
  .all(method);

router
  .route('/fields/create/newField')
  .post(verify, FieldController.createFieldForm)
  .all(method);

router
  .route('/fields/update')
  .post(verify, FieldController.updateFieldForm)
  .all(method);

router
  .route('/fields/:fieldFormId')
  .get(verify, FieldController.getFieldFormDetails)
  .all(method);

router
  .route('/fields/responses/:fieldFormId')
  .get(verify, FieldController.getFieldFormResponses)
  .all(method);

/** PROJECT SECTORS ROUTES */
router
  .route('/sectors')
  .get(SectorController.getSectors)
  .all(method);
router
  .route('/sectors/create')
  .post(verify, Access.accessToEditAndCreateSectors, SectorController.createSector)
  .all(method);

router
  .route('/sectors/:sectorId')
  .get(verify, Access.accessToEditAndCreateSectors, SectorController.getOneSector)
  .all(method);
router
  .route('/sectors/delete/:sectorId')
  .delete(verify, Access.accessToEditAndCreateSectors, SectorController.deleteSector)
  .all(method);
router
  .route('/sectors/update/change_state')
  .put(verify, Access.accessToEditAndCreateSectors, SectorController.updateSector)
  .all(method);

export default router;
