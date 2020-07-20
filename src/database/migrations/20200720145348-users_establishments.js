/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_establishment', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      establishment_id: {
        type: Sequelize.INTEGER,
        references: { model: 'establishment', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('user_establishment');
  },
};
