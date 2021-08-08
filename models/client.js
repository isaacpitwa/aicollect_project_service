'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class clients extends Model{

    static associate(models) {
    }

  };
  clients.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organizationname: {
      type: DataTypes.STRING,
      unique:true
    },
    phone: {
      type: DataTypes.STRING,
    },
    billingPlan:{
      type: DataTypes.INTEGER,
      defaultValue:1
    },
    no_of_users:{
      type: DataTypes.INTEGER,
    },
    no_of_projects:{
      type: DataTypes.INTEGER,
    },
    logo: {
      type: DataTypes.STRING,
    },
    store: {
      type: DataTypes.STRING,
    },
    isSubscriptionActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    modelName: 'clients',
    timestamps: true,
  });
  return clients;
};