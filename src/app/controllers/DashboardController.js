import { Sequelize, Op } from 'sequelize';
import Cid from '../models/Cid';

class DashboardController {
  async index(req, res) {
    return res.json('ok');
  }
}

export default new DashboardController();
