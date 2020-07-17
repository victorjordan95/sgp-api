import Sequelize, { Model } from 'sequelize';

class Cid extends Model {
  static init(sequelize) {
    super.init(
      {
        code: Sequelize.STRING,
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'cid',
      }
    );

    return this;
  }
}

export default Cid;
