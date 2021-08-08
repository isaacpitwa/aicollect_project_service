'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class sectors extends Model{

    static associate(models) {
    }

  };
  sectors.init({
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
    modelName: 'sectors',
    timestamps: true,
  });
  return sectors;
};