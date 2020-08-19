/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appointment', 'establishment_id', {
      type: Sequelize.INTEGER,
      references: { model: 'establishment', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('appointment', 'establishment_id');
  },
};
