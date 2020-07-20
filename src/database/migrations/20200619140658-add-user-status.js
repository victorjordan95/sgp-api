/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('user', 'status');
  },
};
