'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class sectormodules extends Model{

    static associate(models) {
    }

  };
  sectormodules.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulename: {
      type: DataTypes.STRING,
    },
    moduledescription: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    sectorid:{
        type:DataTypes.INTEGER
    },
    ismandatory:{
        type:DataTypes.BOOLEAN
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    addedBy: {
      type: DataTypes.INTEGER,
      defaultValue: null
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
    modelName: 'sectormodules',
    timestamps: true,
  });
  return sectormodules;
};