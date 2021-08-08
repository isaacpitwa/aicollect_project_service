'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // queryInterface.removeConstraint('administrators', 'my_constraint');

    // 2) rename column
    queryInterface.renameColumn('administrators', 'addeBy', 'addedBy');

    // 3) add constraint back
    // queryInterface.addConstraint('administrators', ['addedBy'], {
    //     type: Sequelize.INTEGER,
    //     allowNull:true
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('administratorroles');
  }
};
