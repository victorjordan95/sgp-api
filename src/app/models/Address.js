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
        neighborhood: Sequelize.STRING,
        zipcode: Sequelize.INTEGER,
        locale: Sequelize.GEOMETRY('POINT'),
        full_address: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.street}, ${this.number}, ${this.city}, ${this.state}, ${this.country}`;
          },
        },
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
