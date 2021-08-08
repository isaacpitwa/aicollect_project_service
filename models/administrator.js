'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Administrator extends Model{

    static associate(models) {
    }

  };
  Administrator.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userrole: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    firstTimeProcessor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    processor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clientid: {
      type: DataTypes.INTEGER,
      defaultValue:null,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    addedBy: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true
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
    modelName: 'administrator',
    timestamps: true,
  });
  return Administrator;
};