import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        start: Sequelize.DATE,
        end: Sequelize.DATE,
        all_day: Sequelize.BOOLEAN,
        status: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'appointment',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'patient_id', as: 'patient' });
    this.belongsTo(models.User, { foreignKey: 'doctor_id', as: 'doctor' });
  }
}

export default Appointment;
