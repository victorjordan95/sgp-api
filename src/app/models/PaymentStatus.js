import Sequelize, { Model } from 'sequelize';

class StatusPayment extends Model {
  static init(sequelize) {
    super.init(
      {
        status: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'payment_status',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Payment, { foreignKey: 'status' });
  }
}

export default StatusPayment;
