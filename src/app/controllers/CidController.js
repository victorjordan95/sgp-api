import { Sequelize, Op } from 'sequelize';
import Cid from '../models/Cid';

class CidController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { type, name } = req.query;
    const AMOUNT_PAGE = 50;

    let cidAttributes = {
      attributes: ['id', 'code', 'name'],
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
    };

    if (name) {
      cidAttributes = {
        ...cidAttributes,
        where: Sequelize.where(
          Sequelize.fn('unaccent', Sequelize.col(`${type}`)),
          {
            [Op.iLike]: `%${name}%`,
          }
        ),
      };
    }

    const cid = await Cid.findAndCountAll(cidAttributes);

    const hasNextPage = AMOUNT_PAGE * page < cid.count;
    const hasPreviousPage = page > 1;

    return res.json({ hasPreviousPage, hasNextPage, ...cid });
  }
}

export default new CidController();
