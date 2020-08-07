import { Op } from 'sequelize';
import Address from '../models/Address';
import Establishment from '../models/Establishment';
import Roles from '../models/Roles';
import MedicineCategory from '../models/MedicineCategory';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';
import getRoleValue from '../utils/getRoleValue';

class DoctorController {
  async index(req, res) {
    const { page, userEstab } = req.query;
    const AMOUNT_PAGE = 10;

    let userAttributes = {
      attributes: ['id', 'name', 'email', 'cpf', 'rg'],
      where: {
        status: true,
        role: getRoleValue(RoleEnum.DOCTOR),
      },
      include: [
        {
          model: Roles,
        },
        {
          model: Address,
          as: 'address_pk',
          attributes: ['city'],
        },
        {
          model: Establishment,
          attributes: ['name', 'id'],
          as: 'establishments',
          include: [
            {
              model: MedicineCategory,
              as: 'categories',
              attributes: ['name'],
            },
          ],
          where: {
            id: userEstab.split(',').map(el => Number(el)),
          },
        },
      ],
    };

    if (page) {
      userAttributes = {
        ...userAttributes,
        limit: AMOUNT_PAGE,
        offset: (page - 1) * AMOUNT_PAGE,
      };
    }

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

export default new DoctorController();
