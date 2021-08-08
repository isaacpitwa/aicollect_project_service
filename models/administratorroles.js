'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class AdministratorRoles extends Model{
    static associate(models) {
      // define association here
    }
  };
  AdministratorRoles.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement : true
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
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
    modelName: 'administratorroles',
  });
  return AdministratorRoles;
};