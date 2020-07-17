import * as Yup from 'yup';
import Address from '../models/Address';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class DoctorController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const AMOUNT_PAGE = 10;

    const userAttributes = {
      attributes: ['id', 'name', 'email', 'cpf', 'rg'],
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
      where: {
        status: true,
      },
      include: [
        {
          model: Roles,
          where: {
            role: RoleEnum.DOCTOR,
          },
        },
        {
          model: Address,
          as: 'address_pk',
          attributes: ['city'],
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

export default new DoctorController();
