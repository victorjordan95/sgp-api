import { Sequelize, Op } from 'sequelize';
import Establishment from '../models/Establishment';
import Expense from '../models/Expense';

class ExpenseController {
  async store(req, res) {
    const expense = Expense.create(req.body);
    return res.json(expense);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { estab } = req.query;
    const { type, name } = req.query;
    const AMOUNT_PAGE = 50;

    let paymentAttributes = {
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
      include: [
        {
          model: Establishment,
          attributes: ['id', 'name', 'label', 'value'],
          where: {
            id: estab,
          },
        },
      ],
    };

    if (name) {
      paymentAttributes = {
        ...paymentAttributes,
        where: Sequelize.where(
          Sequelize.fn('unaccent', Sequelize.col(`${type}`)),
          {
            [Op.iLike]: `%${name}%`,
          }
        ),
      };
    }

    const payments = await Expense.findAndCountAll(paymentAttributes);

    return res.json(payments);
  }

  async update(req, res) {
    const expense = await Expense.findByPk(req.body.id);
    const updated = await expense.update(req.body);
    return res.json(updated);
  }
}

export default new ExpenseController();
