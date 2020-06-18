import Sequelize, { Model } from 'sequelize';

class Roles extends Model {
  static init(sequelize) {
    super.init(
      {
        role: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Roles;
