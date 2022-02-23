/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      roles: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
