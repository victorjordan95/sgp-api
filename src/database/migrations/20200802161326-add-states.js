/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('state', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      uf: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      uf_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true,
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
    return queryInterface.dropTable('state');
  },
};
