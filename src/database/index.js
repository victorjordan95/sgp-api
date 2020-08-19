import Sequelize from 'sequelize';

import Address from '../app/models/Address';
import Appointment from '../app/models/Appointment';
import Cid from '../app/models/Cid';
import City from '../app/models/City';
import Contact from '../app/models/Contact';
import Doctor from '../app/models/Doctor';
import Establishment from '../app/models/Establishment';
import Expense from '../app/models/Expense';
import File from '../app/models/File';
import MedicineCategory from '../app/models/MedicineCategory';
import Payment from '../app/models/Payment';
import ProfessionalCoucil from '../app/models/ProfessionalCoucil';
import Roles from '../app/models/Roles';
import Session from '../app/models/Session';
import State from '../app/models/State';
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [
  Address,
  Appointment,
  Cid,
  City,
  Contact,
  Doctor,
  Establishment,
  Expense,
  File,
  MedicineCategory,
  Payment,
  ProfessionalCoucil,
  Roles,
  Session,
  State,
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
