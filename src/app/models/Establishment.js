import Sequelize, { Model } from 'sequelize';

class Establishment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        has_bed: Sequelize.BOOLEAN,
        amount_bed: Sequelize.INTEGER,
        is_pharmacy: Sequelize.BOOLEAN,
        is_public: Sequelize.BOOLEAN,
        location: Sequelize.GEOMETRY('POINT'),
      },
      {
        sequelize,
        tableName: 'establishment',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Address, {
      foreignKey: 'address',
      as: 'address_pk',
    });

    this.belongsTo(models.Contact, { foreignKey: 'contact' });

    this.belongsToMany(models.User, {
      through: 'user_establishment',
      as: 'users',
      foreignKey: 'establishment_id',
    });

    this.belongsToMany(models.MedicineCategory, {
      through: 'establishment_medicine_category',
      as: 'categories',
      foreignKey: 'establishment_id',
    });
  }
}

export default Establishment;
