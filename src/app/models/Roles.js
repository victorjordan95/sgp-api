import Sequelize, { Model } from 'sequelize';

class Roles extends Model {
  static init(sequelize) {
    super.init(
      {
        role: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'role',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'role' });
  }
}

export default Roles;
