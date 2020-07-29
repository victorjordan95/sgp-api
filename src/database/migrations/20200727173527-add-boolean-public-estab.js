/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('establishment', 'is_public', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('establishment', 'is_public');
  },
};
