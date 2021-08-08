'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'clients', 
        'store',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('clients', 'store')
    ]);
  }
};
