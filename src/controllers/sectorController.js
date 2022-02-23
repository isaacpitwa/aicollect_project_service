import SectorService from '../services/SectorService';
import Response from '../utils/response';

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
      const rawData = req.body;
      const sectorExists = await SectorService.findSectorByName(rawData.name);
      if (sectorExists) {
        return Response.conflictError(res, `Sector with name ${rawData.name} already exists`);
      }
      const data = await SectorService.createSector(rawData);
      return Response.customResponse(res, 201, 'Sector has been created successfully', data);
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
      const sectors = await SectorService.getSectors();
      return Response.customResponse(res, 200, 'Sectors retreived successfully', sectors);
    } catch (error) {
      return next(error);
    }
  }
}

export default SectorController;
