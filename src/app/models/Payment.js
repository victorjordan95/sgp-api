import Sequelize, { Model } from 'sequelize';

class Payment extends Model {
  static init(sequelize) {
    super.init(
      {
        appointment_id: Sequelize.INTEGER,
        value: Sequelize.DECIMAL,
        status: Sequelize.INTEGER,
      },
      {
        sequelize,
        tableName: 'payment',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Appointment, { foreignKey: 'appointment_id' });
  }
}

export default Payment;
