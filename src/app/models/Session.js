import Sequelize, { Model } from 'sequelize';

class Session extends Model {
  static init(sequelize) {
    super.init(
      {
        session_token: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'session',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Session;
