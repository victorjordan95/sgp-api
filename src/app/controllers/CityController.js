import { Sequelize, Op } from 'sequelize';
import City from '../models/City';
import State from '../models/State';

class CityController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { cityName, stateName } = req.query;
    const AMOUNT_PAGE = 50;

    const userAttributes = {
      attributes: ['id', 'city_name', 'location'],
      where: {
        city_name: cityName,
      },
      include: [
        {
          model: State,
          attributes: ['uf'],
          where: {
            uf: stateName,
          },
        },
      ],
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
    };

    const city = await City.findAll(userAttributes);

    return res.json(city);
  }
}

export default new CityController();
