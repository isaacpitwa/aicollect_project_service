// import getDatabaseConnection from '../config/mongodbConnection';
import mongooseModels from '../../database/models';
import Response from '../utils/response';

/** class representing Projects Controller */
class ProjectController {
  /**
   * Helper controller function to create a new Project
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from create new Project Endpoint
   */
  static async createProject(req, res, next) {
    try {
      const {
        projectname, description, userId, name, roles
      } = req.body;
      const projectsModel = mongooseModels.projectModel;
      const newProject = new projectsModel({
        projectname,
        description,
        createdBy: { userId, name, roles },
      });
      newProject.save((error, saved) => {
        if (error) {
          // console.log(error);
          return Response.badRequestError(res, 'Project could not be created');
        }
        return Response.customResponse(res, 201, 'Project created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to get all Projects
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from create Get Projects Endpoint
   */
  static async getProjects(req, res, next) {
    try {
      const projects = await mongooseModels.projectModel.find().exec();
      return Response.customResponse(res, 200, 'Projects retrieved successfully', projects);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to add Team Members to Project
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from create AddTeamMembers Endpoint
   */
  static async addMembersToProject(req, res, next) {
    try {
      const {
        userId, name, role, projectId, createdBy
      } = req.body;
      // console.log(req.body);
      const newTeamMember = {
        userId,
        name,
        role,
        createdBy,
        createdAt: new Date()
      };
      const projectExists = await mongooseModels.projectModel.findOne({ _id: projectId });
      if (!projectExists) {
        return Response.notFoundError(res, 'Project with given id was not found');
      }
      const updatedProject = await mongooseModels.projectModel
        .updateOne({ _id: projectId }, { $push: { projectTeam: newTeamMember } });
      return Response.customResponse(res, 200, 'Project member added successfully', updatedProject);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to get one Projects
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from create Get One Project Endpoint
   */
  static async getProjectDetails(req, res, next) {
    try {
      const projectId = req.params.id;
      const project = await mongooseModels.projectModel.findOne({ _id: projectId });
      if (!project) {
        return Response.notFoundError(res, 'Project was either deleted or does not exist');
      }
      return Response.customResponse(res, 200, 'Project details retrieved', project);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProjectController;
