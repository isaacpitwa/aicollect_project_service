// import getDatabaseConnection from '../config/mongodbConnection';
import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';
import { redisConnection } from '../utils/sessionManager';

const { projectModel } = mongooseModels;

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
      let clientId;
      if (roles === 'Owner') {
        clientId = userId;
      }
      const newProject = new projectsModel({
        _id: mongoose.Types.ObjectId(),
        projectname,
        description,
        clientId,
        projectOwner: clientId,
        createdBy: { userId, name, roles },
      });
      newProject.save((error, saved) => {
        if (error) {
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
      // console.log('Error DEBUG: \n', error);
      return next(error);
    }
  }

  /**
   * Helper controller function to get all Projects for particular User
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from create Get Projects Endpoint
   */
  static async getUserProjects(req, res, next) {
    try {
      if (!req.body.clientId) {
        return Response.badRequestError(res, 'Please provide a valid user id');
      }
      // Check for projects from Redis server before hitting up the server
      // redisConnection.get('projects', async (err, projects) => {
      //   if (err) {
      //     return Response.badRequestError(res, 'Error occured when connecting to redis server');
      //   }
      //   if (projects) {
      //     return Response.customResponse(
      // res, 200, 'Projects retreved from cache', JSON.parse(projects));
      //   }
      //   const projectsFromDB = await mongooseModels.projectModel.find({
      //     projectOwner: req.body.clientId
      //   });
      //   redisConnection.setex('projects', 1440, JSON.stringify(projectsFromDB));
      //   return Response.customResponse(res,
      // 200, 'Projects retrieved successfully', projectsFromDB);
      // });
      const { roles, id, } = req.user;
      let projects;
      if (['Owner', 'Admin'].includes(roles)) {
        projects = await mongooseModels.projectModel.find({ projectOwner: req.body.clientId });
      } else if (roles === 'Supervisor') {
        projects = await mongooseModels.projectModel.find({
          'projectTeam.supervisor': id
        });
        projects = projects.map(
          (project) => {
            project.projectTeam = project.projectTeam.filter((member) => member.supervisor === id);
            return project;
          }
        );
      } else {
        projects = await mongooseModels.projectModel.find({ 'projectTeam.userId': id });
      }

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
        userId, name, role, projectId, createdBy, supervisor
      } = req.body;
      // console.log(req.body);
      const newTeamMember = {
        userId,
        name,
        role,
        createdBy,
        supervisor,
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
      const { roles, id, } = req.user;
      // check for project from Redis server before dialing up the server
      // eslint-disable-next-line no-unused-vars
      redisConnection.get('projectId', async (err, project) => {
        if (err) {
          return Response.badRequestError(res, 'Error occured when connecting to redis server');
        }
        // if (project) {
        //   return Response.customResponse(
        //     res,
        //     200,
        //     'Project details retreieved from cache',
        //     JSON.parse(project)
        //   );
        // }
        // dial up server
        const projectFromDB = await mongooseModels.projectModel.findOne({ _id: projectId });

        if (!projectFromDB) {
          return Response.notFoundError(res, 'Project was either deleted or does not exist');
        }
        // Remmove users not supervised by the user
        if (roles === 'Supervisor') {
          projectFromDB.projectTeam = projectFromDB.projectTeam.filter(
            (member) => member.supervisor === id
          );
        }
        // eslint-disable-next-line no-underscore-dangle
        redisConnection.setex('projectId', 1440, JSON.stringify(projectFromDB));
        return Response.customResponse(res, 200, 'Project details retrieved', projectFromDB);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to update Projects
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from Update Project Endpoint
   */
  static async updateProject(req, res, next) {
    try {
      const projectExists = await projectModel.findById(req.body.projectId).exec();
      if (!projectExists) {
        return Response.notFoundError(res, 'Project does not exist');
      }
      projectModel.updateOne({ _id: req.body.projectId }, req.body, (err, data) => {
        if (err) {
          return Response.badRequestError(res, 'Could not update project');
        }
        return Response.customResponse(res, 200, 'Project updated successfully', data);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to update Projects by deleting User from Projects
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from Update Project Endpoint
   */
  static async deleteUserFromProjects(req, res, next) {
    try {
      projectModel.updateMany({ 'projectTeam.userId': req.body.userId }, { $pull: { projectTeam: { userId: req.body.userId } } }, (err, data) => {
        if (err) {
          return Response.badRequestError(res, 'Could not update project');
        }
        return Response.customResponse(res, 200, 'Project updated successfully', data);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Helper controller function to delete Projects
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {function} next Express Next Function
   * @returns {object} Response from Delete Project Endpoint
   */
  static async deleteProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const projectExists = await projectModel.findById(projectId);
      if (!projectExists) {
        return Response.notFoundError(res, 'Project does not exist');
      }
      const deleteProject = await projectModel.deleteOne({ _id: projectId });
      return Response.customResponse(res, 200, 'Project was successfully deleted', deleteProject);
    } catch (error) {
      return next(error);
    }
  }
}

export default ProjectController;
