import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        start: Sequelize.DATE,
        end: Sequelize.DATE,
        all_day: Sequelize.BOOLEAN,
        canceled_at: Sequelize.DATE,
        status: Sequelize.INTEGER,
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
    this.belongsTo(models.Establishment, {
      foreignKey: 'establishment_id',
      as: 'establishment',
    });
  }
}

export default Appointment;
