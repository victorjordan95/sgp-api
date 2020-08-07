import * as Yup from 'yup';
import Address from '../models/Address';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class PatientController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const AMOUNT_PAGE = 10;

    let userAttributes = {
      attributes: ['id', 'name', 'email', 'cpf', 'rg'],
      where: {
        status: true,
      },
      include: [
        {
          model: Roles,
          where: {
            role: RoleEnum.PATIENT,
          },
        },
        {
          model: Address,
          as: 'address_pk',
          attributes: ['city'],
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

export default new PatientController();
