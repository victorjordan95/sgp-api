/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'role', {
      type: Sequelize.INTEGER,
      references: { model: 'roles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('user', 'role');
  },
};
