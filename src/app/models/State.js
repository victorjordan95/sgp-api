import Sequelize, { Model } from 'sequelize';

class State extends Model {
  static init(sequelize) {
    super.init(
      {
        uf_code: Sequelize.INTEGER,
        uf: Sequelize.STRING,
        uf_name: Sequelize.STRING,
        location: Sequelize.GEOMETRY('POINT'),
      },
      {
        sequelize,
        tableName: 'state',
      }
    );

    return this;
  }
}

export default State;
