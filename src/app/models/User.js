import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cpf: Sequelize.NUMBER,
        rg: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Address, {
      foreignKey: 'address',
      as: 'address_pk',
    });

    this.belongsTo(models.Roles, { foreignKey: 'role' });
    this.belongsTo(models.Contact, { foreignKey: 'contact' });
  }
}

export default User;
