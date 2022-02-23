/* eslint-disable strict */

'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /** class representing Sector */
  class Sector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {object} models Database Models
     * @returns {object} relationship with other Models
     */
    static associate(models) {
      // define association here
      Sector.hasMany(models.Profile);
    }
  }
  Sector.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sector',
  });
  return Sector;
};
