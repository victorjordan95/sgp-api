import Sequelize, { Model } from 'sequelize';

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        ibge_code: Sequelize.INTEGER,
        city_name: Sequelize.STRING,
        location: Sequelize.GEOMETRY('POINT'),
        capital: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'city',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.State, { foreignKey: 'uf_code' });
  }
}

export default City;
