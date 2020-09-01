import { Op } from 'sequelize';
import Address from '../models/Address';
import Establishment from '../models/Establishment';
import User from '../models/User';
import Roles from '../models/Roles';
import RoleEnum from '../enums/Roles.enum';

import client from '../../database/db';

class EmployeeController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const AMOUNT_PAGE = 10;

    const userEstabs = await client.query(
      `select estab.id from "establishment" as estab
      join user_establishment as uestab
      on estab.id = uestab.establishment_id
      where uestab.user_id = ${req.userId}`
    );

    if (!userEstabs) {
      return res.json([]);
    }

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
      users = await client.query(
        `select us.cpf, us.id, us.rg, us.name, us.email,
        r.role as rolename, e.name as estabName, e.id as estabid
        from "user" us
        inner join user_establishment
        on us.id = user_establishment.user_id
        inner join establishment e
        on e.id = user_establishment.establishment_id
        inner join role r
        on us.role = r.id
        where user_establishment.establishment_id
        in (${JSON.stringify(userEstabs.rows.map(el => el.id))
          .replace('[', '')
          .replace(']', '')});`
      );
    }
    const hasNextPage = AMOUNT_PAGE * page < users.count;
    const hasPreviousPage = page > 1;
    return res.json(users);
  }
}

export default new EmployeeController();
