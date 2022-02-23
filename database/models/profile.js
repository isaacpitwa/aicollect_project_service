/* eslint-disable strict */

'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /** class representing Profile */
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {object} models Database tables
     * @returns {object} relation to other tables
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
      Profile.belongsTo(models.Sector);
    }
  }
  Profile.init({
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyLogo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    SectorId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};
