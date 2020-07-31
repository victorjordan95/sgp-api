import { Op } from 'sequelize';
import Address from '../models/Address';
import Establishment from '../models/Establishment';
import User from '../models/User';
import Roles from '../models/Roles';
import RoleEnum from '../enums/Roles.enum';

class EmployeeController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const AMOUNT_PAGE = 10;

    const employee = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Establishment,
          attributes: ['id'],
          as: 'establishments',
        },
      ],
    });
    const employeeEstabId = employee.establishments[0].user_establishment.get(
      'establishment_id'
    );

    const userAttributes = {
      attributes: ['id', 'name', 'email', 'cpf', 'rg'],
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
      where: {
        status: true,
      },
      include: [
        {
          model: Address,
          as: 'address_pk',
          attributes: ['city'],
        },
        {
          model: Establishment,
          as: 'establishments',
          attributes: ['id'],
          where: {
            id: employeeEstabId,
          },
        },
        {
          model: Roles,
          where: {
            [Op.or]: [
              { role: RoleEnum.DOCTOR },
              { role: RoleEnum.EMPLOYEE },
              { role: RoleEnum.ADMIN },
            ],
          },
        },
      ],
    };

    let users;
    if (req.params.id) {
      users = await User.findByPk(req.params.id, userAttributes);
    } else {
      users = await User.findAndCountAll(userAttributes);
    }

    const hasNextPage = AMOUNT_PAGE * page < users.count;
    const hasPreviousPage = page > 1;

    return res.json({ hasPreviousPage, hasNextPage, ...users });
  }
}

export default new EmployeeController();