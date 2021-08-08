'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class questionaires extends Model{

    static associate(models) {
    }

  };
  questionaires.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    ismandatory : {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    },
    moduleid : {
      type: DataTypes.INTEGER,
      defaultValue:null
    },
    sectorid : {
      type: DataTypes.INTEGER,
    },
    parentid : {
      type: DataTypes.INTEGER,
      defaultValue:null
    },
    formschema : {
      type: DataTypes.STRING,
      defaultValue:null
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
    modelName: 'questionaires',
    timestamps: true,
  });
  return questionaires;
};