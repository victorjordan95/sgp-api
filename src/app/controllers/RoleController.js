import Roles from '../models/Roles';

class RoleController {
  async store(req, res) {
    const role = await Roles.create(req.body);
    return res.json(role);
  }
}

export default new RoleController();
