/* eslint-disable no-plusplus */
import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';

const { taskModel, formModel } = mongooseModels;

/** class representing Task Controller */
class TaskController {
  /**
   * @description Fetch all Tasks
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {object} next Express Next Function
   * @returns {object} Response from Get Tasks Endpoint
   */
  static async getTasks(req, res, next) {
    try {
      const tasks = await taskModel.find().exec();
      return Response.customResponse(res, 200, 'Tasks retrieved successfully', tasks);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Fetch all Project Tasks
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {object} next Express Next Function
   * @returns {object} Response from Get Project Tasks Endpoint
   */
  static async getProjectTasks(req, res, next) {
    try {
      const tasks = await taskModel.find({ project: req.body.projectId }).exec();
      return Response.customResponse(res, 200, 'Project Tasks retrieved successfully', tasks);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Get Task Details
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {object} next Express Next Function
   * @returns {object} Response from Task Details Endpoint
   */
  static async getTaskDetails(req, res, next) {
    try {
      const { taskId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return Response.validationError(res, 'Please provide a valid project id');
      }
      const task = await taskModel.findOne({ _id: taskId });
      if (!task) {
        return Response.notFoundError(res, 'Task does not exist');
      }
      return Response.customResponse(res, 200, 'Tasks retrieved successfully', task);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Get Task For User
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {object} next Express Next Function
   * @returns {object} Response from Task for user Endpoint
   */
  static async getUserTasks(req, res, next) {
    try {
      const { userId, name, roles } = req.body;
      const user = {
        userId, name, role: roles
      };
      const tasks = await taskModel.find({
        $and: [{ 'team.userId': user.userId }]
      });
      // List of Questionaires
      const list = [];
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].questionaire.forEach(async (form) => {
          list.push(form);
        });
      }
      // Find all questionaires with provided IDS
      const forms = await formModel.find({
        _id: [...list]
      });
      const tasksWithQuestionaires = {
        tasks,
        forms
      };
      return Response.customResponse(
        res, 200,
        'User tasks retrieved successfully',
        tasksWithQuestionaires
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Create Task
   * @param {object} req Express Request
   * @param {object} res Express Response
   * @param {object} next Express Next Function
   * @returns {object} Response from Create Endpoint
   */
  static async createTask(req, res, next) {
    try {
      const {
        title,
        taskType, description, startDate, dueDate, schedule, team, questionaire, project, createdBy
      } = req.body;
      const task = new taskModel({
        _id: mongoose.Types.ObjectId(),
        title,
        taskType,
        description,
        startDate,
        dueDate,
        schedule,
        team,
        questionaire,
        project,
        createdBy
      });
      task.save((error, saved) => {
        if (error) {
          return Response.badRequestError(res, 'Something went wrong while creating task');
        }
        return Response.customResponse(res, 201, 'Task created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default TaskController;
