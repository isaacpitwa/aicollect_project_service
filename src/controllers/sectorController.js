import mongoose from 'mongoose';
import mongooseModels from '../database/models';
import Response from '../utils/response';

const { sectorModel } = mongooseModels;

/** Class Representing Sector */
class SectorController {
  /**
   * Creates a new sector in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the create sector Endpoint
   */
  static async createSector(req, res, next) {
    try {
      const { title, description, createdBy } = req.body;
      const newsector = new sectorModel({
        _id: mongoose.Types.ObjectId(),
        title,
        description,
        modules: [],
        createdBy,
      });
      newsector.save((error, saved) => {
        if (error) {
          return Response.badRequestError(res, 'Sector could not be created');
        }
        return Response.customResponse(res, 201, 'Sector created successfully', saved);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all sectors in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the get sectors Endpoint
   */
  static async getSectors(req, res, next) {
    try {
      const sectors = await sectorModel.find();
      return Response.customResponse(res, 200, 'Sectors retreived successfully', sectors);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get one sector in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the get one sector Endpoint
   */
  static async getOneSector(req, res, next) {
    try {
      const sectorExists = await sectorModel.find({ _id: req.params.sectorId });
      if (!sectorExists) {
        return Response.notFoundError(res, 'Sector with provided id does not exist');
      }
      return Response.customResponse(res, 200, 'Sector retrieved successfully', sectorExists);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete sector in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the Delete sector Endpoint
   */
  static async deleteSector(req, res, next) {
    try {
      const sectorExists = await SectorService.findSectorById(req.params.sectorId);
      if (!sectorExists) {
        return Response.notFoundError(res, 'Sector with provided id does not exist');
      }
      const deleted = await SectorService.deleteSector(sectorExists.id);
      return Response.customResponse(res, 200, 'Sector successfully deleted', deleted);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Disable / Enable sector in the Database
   * @param {object} req Express Request
   * @param {*} res Express Response
   * @param {*} next Express Next Function
   * @returns {object} Response from the Disable / Enable sector Endpoint
   */
  static async changeSectorState(req, res, next) {
    try {
      const { status, sectorId } = req.body;
      const sectorExists = await SectorService.findSectorById(sectorId);
      if (!sectorExists) {
        return Response.notFoundError('Sector with provided ID does not exist');
      }
      const changedSector = await SectorService.changeSectorStatus(status, sectorId);
      return Response.customResponse(res, 200, 'Sector status changed successfully', changedSector);
    } catch (error) {
      return next(error);
    }
  }
}

export default SectorController;
