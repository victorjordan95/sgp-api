/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('establishment', 'location', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('establishment', 'location');
  },
};
