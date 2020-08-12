/* eslint-disable linebreak-style */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('doctor', 'professional_coucil', {
      type: Sequelize.INTEGER,
      references: { model: 'professional_coucil', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('doctor', 'professional_coucil');
  },
};
