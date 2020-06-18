import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        country: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'address',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'address', as: 'user' });
  }
}

export default Address;
