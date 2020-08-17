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
}

export default Payment;
