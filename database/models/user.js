/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /** Class representing User Model */
  class User extends Model {
    /** User Model relation Associations
     * @param  {object} models Other database tables
     * @returns {object} Relations of User Model to other Models
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { onDelete: 'RESTRICT' });
      User.hasMany(models.Session);
    }
  }
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Admin',
      validate: {
        isIn: {
          args: [
            [
              'Owner',
              'Admin',
              'Data Manager',
              'Supervisor',
              'Standard user',
              'External user',
              'Billing Manager'
            ]
          ],
          msg:
            'User Roles must either be Owner, Admin, Supervisor ,Standard user, External user or Billing Manager'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    createdBy: {
      type: DataTypes.INTEGER,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
