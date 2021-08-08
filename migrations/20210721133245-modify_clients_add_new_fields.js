'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'clients', // table name
        'billingid', // new field name
        {
          defaultValue: 1,
        },
      ),
      queryInterface.addColumn(
        'clients',
        'no_of_users',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'clients',
        'no_of_projects',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
    ]);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('clients', 'billingid'),
      queryInterface.removeColumn('clients', 'no_of_sources'),
      queryInterface.removeColumn('clients', 'no_of_projects'),
    ]);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
