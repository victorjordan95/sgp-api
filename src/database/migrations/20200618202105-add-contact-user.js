/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'contact', {
      type: Sequelize.INTEGER,
      references: { model: 'contact', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('user', 'contact');
  },
};
