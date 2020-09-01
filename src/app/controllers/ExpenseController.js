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
    const { type, columnName } = req.query;
    const AMOUNT_PAGE = 50;

    if (!estab) {
      return res.json([]);
    }

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

    if (columnName) {
      paymentAttributes = {
        ...paymentAttributes,
        where: Sequelize.where(
          Sequelize.fn('unaccent', Sequelize.col(`Expense.${columnName}`)),
          {
            [Op.iLike]: `%${type}%`,
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

  async delete(req, res) {
    const expense = await Expense.findByPk(req.params.id);
    const updated = await expense.destroy();
    return res.json(updated);
  }
}

export default new ExpenseController();
