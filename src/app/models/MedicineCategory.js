import Sequelize, { Model } from 'sequelize';

class MedicineCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'medicine_category',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Establishment, {
      through: 'establishment_medicine_category',
      as: 'establishments',
      foreignKey: 'medicine_id',
    });
  }
}

export default MedicineCategory;
