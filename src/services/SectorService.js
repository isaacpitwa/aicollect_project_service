/* eslint-disable no-useless-catch */
import { Sector } from '../../database/models';

/** Class representing Sector Service Functions */
class SectorService {
  /**
   * Utility function to get all sectors
   * @returns {object} List of sectors
   */
  static async getSectors() {
    try {
      const sectors = await Sector.findAll();
      return sectors;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility Service to create
   * a new sector
   * @param {object} sector Sector to be created
   * @returns {object} Created Sector
   */
  static async createSector(sector) {
    try {
      const newSector = await Sector.create(sector);
      return newSector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility function to find One Sector from the database
   * @param {number} sectorId Id of the Sector to compare against
   * @returns {object} Returns Sector of provided ID
   */
  static async findSectorById(sectorId) {
    try {
      const sector = await Sector.findOne({ where: { id: sectorId } });
      return sector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility function to find One Sector from the database
   * @param {string} sectorName Name of the Sector to compare against
   * @returns {object} Returns Sector of provided Name
   */
  static async findSectorByName(sectorName) {
    try {
      const sector = await Sector.findOne({ where: { id: sectorName } });
      return sector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility function to udpate a sector
   * @param {number} param Parameter of the sector to be updated
   * @param {object} sector Sector object with updates
   * @returns {object} Returns updated sector
   */
  static async updateSector(param, sector) {
    try {
      const updatedSector = await Sector.update(sector, {
        return: true,
        where: [param]
      });
      return updatedSector;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility function to delete a sector
   * @param {number} sectorId The ID of sector to be deleted
   * @returns {object} Returns the Deleted sector
   */
  static async deleteSector(sectorId) {
    try {
      const sectorToBeDeleted = await Sector.destroy(sectorId);
      return sectorToBeDeleted;
    } catch (error) {
      throw error;
    }
  }
}

export default SectorService;
