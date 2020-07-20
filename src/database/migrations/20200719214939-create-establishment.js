/* eslint-disable linebreak-style */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('establishment', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.INTEGER,
        references: { model: 'address', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      contact: {
        type: Sequelize.INTEGER,
        references: { model: 'contact', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      has_bed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      amount_bed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_pharmacy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    return queryInterface.dropTable('establishment');
  },
};
