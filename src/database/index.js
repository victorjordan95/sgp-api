import Sequelize from 'sequelize';

import Address from '../app/models/Address';
import Appointment from '../app/models/Appointment';
import Cid from '../app/models/Cid';
import Contact from '../app/models/Contact';
import Establishment from '../app/models/Establishment';
import File from '../app/models/File';
import MedicineCategory from '../app/models/MedicineCategory';
import Roles from '../app/models/Roles';
import Session from '../app/models/Session';
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [
  Address,
  Appointment,
  Cid,
  Contact,
  Establishment,
  File,
  MedicineCategory,
  Roles,
  Session,
  User,
];

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
