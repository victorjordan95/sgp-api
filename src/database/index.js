import Sequelize from 'sequelize';

import User from '../app/models/User';
import Roles from '../app/models/Roles';

import databaseConfig from '../config/database';

const models = [User, Roles];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(
        model =>
          model && model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
