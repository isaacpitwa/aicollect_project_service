'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class companylogs extends Model{

    static associate(models) {
    }

  };
  companylogs.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clientid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    log: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue:sequelize.fn('NOW')
    }
  }, {
    sequelize,
    modelName: 'companylogs',
    timestamps: true,
  });
  return companylogs;
};