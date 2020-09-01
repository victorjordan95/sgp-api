/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('doctor', 'coucil_number', {
      type: Sequelize.STRING,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('doctor', 'coucil_number');
  },
};
