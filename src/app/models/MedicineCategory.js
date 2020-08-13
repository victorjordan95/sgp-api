import Sequelize, { Model } from 'sequelize';

class MedicineCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        label: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.name;
          },
        },
        value: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.id;
          },
        },
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

    this.belongsToMany(models.Doctor, {
      through: 'doctor_medicine_category',
      as: 'doctors',
      foreignKey: 'medicine_id',
    });
  }
}

export default MedicineCategory;
