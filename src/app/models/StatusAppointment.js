import Sequelize, { Model } from 'sequelize';

class StatusAppointment extends Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'status_appointment',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Appointment, { foreignKey: 'status' });
  }
}

export default StatusAppointment;
