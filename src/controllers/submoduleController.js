import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';

const { submoduleModel } = mongooseModels;

/** Class Representing Submodule */
class SubmoduleController {
  /**
   * Creates a new Submodule in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the create Submodule Endpoint
   */
  static async create(req, res, next) {
    try {
      const { name, project,module } = req.body;
      const { id,firstname,lastname,client,roles } = req.user;

      const newsubmodule = new submoduleModel({
        _id: mongoose.Types.ObjectId(),
        name,
        createdBy: {
            id,
            name: `${firstname} ${lastname}`,
            roles,
        },
        module,
        client,
        project,
      });
      newsubmodule.save((error, saved) => {
        if (error) {
          console.log(error);
          return Response.badRequestError(res, error._message ?? 'Submodule could not be created');
        }
        return Response.customResponse(res, 201, 'Submodule created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }

}

export default SubmoduleController;