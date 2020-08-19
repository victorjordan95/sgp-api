import { Op } from 'sequelize';
import { startOfMonth, lastDayOfMonth } from 'date-fns';
import Appointment from '../models/Appointment';
import Contact from '../models/Contact';
import Establishment from '../models/Establishment';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class ScheduleController {
  async index(req, res) {
    const { doctorId } = req.query;
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

    const { date } = req.query;
    const formattedDate = new Date(date || '');
    const appointments = await Appointment.findAll({
      where: {
        doctor_id: Number(doctorId) || req.userId,
        canceled_at: null,
        [Op.or]: [{ status: 2 }, { status: 5 }, { status: 3 }],
        start: {
          [Op.between]: [
            startOfMonth(formattedDate),
            lastDayOfMonth(formattedDate),
          ],
        },
      },
      attributes: [
        'id',
        'title',
        'start',
        'end',
        'all_day',
        'patient_id',
        'status',
      ],
      order: ['start'],
    });

    return res.json(appointments);
  }

  async indexRequests(req, res) {
    const { page = 1 } = req.query;
    const { name } = req.query;
    const AMOUNT_PAGE = 50;

    const employee = await User.findOne({
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
        {
          model: Establishment,
          attributes: ['id'],
          as: 'establishments',
        },
      ],
    });

    const employeeEstabId =
      employee.establishments[0] &&
      employee.establishments[0].user_establishment.get('establishment_id');

    if (!employeeEstabId) {
      return res.json([]);
    }

    if (!employee) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    let userAttributes = {
      attributes: [
        'id',
        'title',
        'start',
        'end',
        'all_day',
        'patient_id',
        'doctor_id',
      ],
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['name'],
          include: [
            {
              model: Establishment,
              attributes: ['name', 'id'],
              as: 'establishments',
              where: {
                id: employeeEstabId,
              },
            },
          ],
        },
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
        status: 1,
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
          status: 1,
        },
      };
    }

    const appointments = await Appointment.findAll(userAttributes);
    return res.json({ count: appointments.length, rows: appointments });
  }

  async approveRequest(req, res) {
    const isEmployee = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            [Op.or]: [{ role: RoleEnum.EMPLOYEE }, { role: RoleEnum.ADMIN }],
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
    const updatedAppointment = await appointment.update({
      status: Number(req.body.status),
    });

    return res.json(updatedAppointment);
  }

  async countRequests(req, res) {
    const AMOUNT_PAGE = 10000;
    const employee = await User.findOne({
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
        {
          model: Establishment,
          attributes: ['id'],
          as: 'establishments',
        },
      ],
    });

    const employeeEstabId =
      employee.establishments[0] &&
      employee.establishments[0].user_establishment.get('establishment_id');

    if (!employeeEstabId) {
      return res.json([]);
    }

    if (!employee) {
      return res.status(401).json({
        error: `Você não tem permissão para este tipo de acesso!`,
      });
    }

    const userAttributes = {
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['name'],
          include: [
            {
              model: Establishment,
              as: 'establishments',
              where: {
                id: employeeEstabId,
              },
            },
          ],
        },
      ],
      where: {
        canceled_at: null,
        status: 1,
      },
      order: ['start'],
      limit: AMOUNT_PAGE,
    };

    const appointments = await Appointment.findAll(userAttributes);
    return res.json({ count: appointments.length });
  }
}

export default new ScheduleController();
