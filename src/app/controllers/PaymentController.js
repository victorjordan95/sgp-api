import { Sequelize, Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Establishment from '../models/Establishment';
import User from '../models/User';
import Payment from '../models/Payment';

class PaymentController {
  async store(req, res) {
    const payment = await Payment.findOne({
      where: {
        appointment_id: req.body.appointment_id,
      },
    });
    if (payment) {
      payment.update(req.body);
    } else {
      Payment.create(req.body);
    }
    return res.json(payment);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { type, name } = req.query;
    const AMOUNT_PAGE = 50;

    let paymentAttributes = {
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
      include: [
        {
          model: Appointment,
          attributes: ['doctor_id'],
          include: [
            {
              model: Establishment,
              as: 'establishment',
              where: {
                id: 11,
              },
            },
          ],
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

    const payments = await Payment.findAndCountAll(paymentAttributes);

    return res.json(payments);
  }
}

export default new PaymentController();
