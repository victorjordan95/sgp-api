import Sequelize, { Model } from 'sequelize';

class Expense extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        value: Sequelize.DECIMAL,
      },
      {
        sequelize,
        tableName: 'expense',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Establishment, {
      foreignKey: 'establishment_id',
    });
  }
}

export default Expense;
