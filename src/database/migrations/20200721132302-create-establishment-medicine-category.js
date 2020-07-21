/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('establishment_medicine_category', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      medicine_id: {
        type: Sequelize.INTEGER,
        references: { model: 'medicine_category', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      establishment_id: {
        type: Sequelize.INTEGER,
        references: { model: 'establishment', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('user_establishment');
  },
};
