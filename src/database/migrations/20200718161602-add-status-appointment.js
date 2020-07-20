/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appointment', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'AGUARDANDO',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('appointment', 'status');
  },
};
