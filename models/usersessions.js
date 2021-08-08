'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class usersessions extends Model{
    static associate(models) {
      // define association here
    }
  };
  usersessions.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement : true
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    usertoken: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
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
    modelName: 'usersessions',
  });
  return usersessions;
};