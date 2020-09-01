import Sequelize, { Model } from 'sequelize';

class Doctor extends Model {
  static init(sequelize) {
    super.init(
      {
        start_hour: Sequelize.STRING,
        end_hour: Sequelize.STRING,
        time_appointment: Sequelize.STRING,
        coucil_number: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'doctor',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProfessionalCoucil, {
      foreignKey: 'professional_coucil',
    });

    this.belongsToMany(models.MedicineCategory, {
      through: 'doctor_medicine_category',
      as: 'categories',
      foreignKey: 'doctor_id',
    });
  }
}

export default Doctor;
