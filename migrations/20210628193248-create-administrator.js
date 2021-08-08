'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('administrators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      firstTimeProcessor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      processor: {
        type: Sequelize.STRING,
        allowNull: true
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue:null,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      addeBy: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('administrators');
  }
};