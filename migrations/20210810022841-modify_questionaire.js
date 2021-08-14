'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'sectormodules', 
        'type', 
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('sectormodules', 'type'),
    ]);
  }
};
