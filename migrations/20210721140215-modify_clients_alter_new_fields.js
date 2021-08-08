'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      queryInterface.addColumn(
        'clients', // table name
        'billingPlan', // new field name
        {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
      ),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
