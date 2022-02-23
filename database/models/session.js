/* eslint-disable strict */
/* eslint-disable require-jsdoc */

'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      Session.belongsTo(models.User);
    }
  }
  Session.init({
    usertoken: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};
