import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfMonth, lastDayOfMonth } from 'date-fns';
import Appointment from '../models/Appointment';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class AppointmentController {
  async index(req, res) {
    const { start = new Date() } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        patient_id: req.userId,
        canceled_at: null,
        start: { [Op.between]: [startOfMonth(start), lastDayOfMonth(start)] },
      },
      order: ['start'],
      attributes: ['id', 'start', 'doctor_id'],
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['name'],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start: Yup.date().required(),
      end: Yup.date().required(),
      doctor_id: Yup.number().required(),
      patient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { patient_id } = req.body;

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

    let status;
    if (isEmployee) {
      status = { status: 2 };
    } else {
      status = { status: 1 };
    }

    const patientName = await User.findOne({
      where: { id: patient_id },
      attributes: ['name'],
    });

    const appointment = await Appointment.create({
      ...req.body,
      title: patientName.dataValues.name,
      ...status,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
