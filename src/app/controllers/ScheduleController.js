import { Sequelize, Op, query, QueryTypes } from 'sequelize';
import { startOfMonth, lastDayOfMonth } from 'date-fns';
import Appointment from '../models/Appointment';
import Contact from '../models/Contact';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class ScheduleController {
  async index(req, res) {
    const isDoctor = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            [Op.or]: [{ role: RoleEnum.DOCTOR }, { role: RoleEnum.EMPLOYEE }],
          },
        },
      ],
    });

    if (!isDoctor) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    const { date } = req.query;
    const formattedDate = new Date(date || '');
    const appointments = await Appointment.findAll({
      where: {
        doctor_id: req.userId,
        canceled_at: null,
        status: 'AGENDADO',
        start: {
          [Op.between]: [
            startOfMonth(formattedDate),
            lastDayOfMonth(formattedDate),
          ],
        },
      },
      attributes: ['id', 'title', 'start', 'end', 'all_day', 'patient_id'],
      order: ['start'],
    });

    return res.json(appointments);
  }

  async indexRequests(req, res) {
    const { page = 1 } = req.query;
    const { name } = req.query;
    const AMOUNT_PAGE = 50;

    const isDoctor = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            [Op.or]: [{ role: RoleEnum.DOCTOR }, { role: RoleEnum.EMPLOYEE }],
          },
        },
      ],
    });

    if (!isDoctor) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    let userAttributes = {
      attributes: ['id', 'title', 'start', 'end', 'all_day', 'patient_id'],
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['name'],
          include: [
            {
              model: Contact,
              attributes: ['phone', 'cellphone'],
            },
          ],
        },
      ],
      where: {
        canceled_at: null,
        status: 'AGUARDANDO',
      },
      order: ['start'],
      limit: AMOUNT_PAGE,
      offset: (page - 1) * AMOUNT_PAGE,
    };

    if (name) {
      userAttributes = {
        ...userAttributes,
        where: {
          title: { [Op.iLike]: `%${name}%` },
          status: { [Op.iLike]: '%AGUARDANDO%' },
        },
      };
    }

    const appointments = await Appointment.findAndCountAll(userAttributes);

    return res.json(appointments);
  }

  async approveRequest(req, res) {
    const isEmployee = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            role: RoleEnum.EMPLOYEE,
          },
        },
      ],
    });

    if (!isEmployee) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    const appointment = await Appointment.findByPk(req.body.id);
    appointment.update({ status: 'AGENDADO' });

    return res.json(appointment);
  }

  async countRequests(req, res) {
    const isDoctor = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            [Op.or]: [
              { role: RoleEnum.DOCTOR },
              { role: RoleEnum.EMPLOYEE },
              { role: RoleEnum.ADMIN },
            ],
          },
        },
      ],
    });

    if (!isDoctor) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    const userAttributes = {
      where: {
        canceled_at: null,
        status: 'AGUARDANDO',
      },
    };

    const appointments = await Appointment.count(userAttributes);

    return res.json(appointments);
  }
}

export default new ScheduleController();
