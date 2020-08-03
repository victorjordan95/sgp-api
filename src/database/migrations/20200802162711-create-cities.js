/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('city', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      city_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true,
      },

      capital: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      uf_code: {
        type: Sequelize.INTEGER,
        references: { model: 'state', key: 'id' },
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
    return queryInterface.dropTable('city');
  },
};
