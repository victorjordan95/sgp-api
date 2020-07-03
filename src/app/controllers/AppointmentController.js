import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfMonth, lastDayOfMonth } from 'date-fns';
import Appointment from '../models/Appointment';
import Roles from '../models/Roles';
import User from '../models/User';
import RoleEnum from '../enums/Roles.enum';

class AppointmentController {
  async index(req, res) {
    const { date = new Date() } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        patient_id: req.userId,
        canceled_at: null,
        date: { [Op.between]: [startOfMonth(date), lastDayOfMonth(date)] },
      },
      order: ['date'],
      attributes: ['id', 'date', 'doctor_id'],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      doctor_id: Yup.number().required(),
      patient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { doctor_id, date } = req.body;
    const isDoctor = await User.findOne({
      where: {
        id: doctor_id,
        include: [
          {
            model: Roles,
            attributes: ['role'],
            where: {
              role: RoleEnum.DOCTOR,
            },
          },
        ],
      },
    });

    const isEmployee = await User.findOne({
      where: { id: req.userId },
      include: [
        {
          model: Roles,
          attributes: ['role'],
          where: {
            role: RoleEnum.ADMIN,
          },
        },
      ],
    });

    if (!isDoctor) {
      return res.status(401).json({
        error: `Você só pode agendar consultas para usuários do tipo ${RoleEnum.DOCTOR}`,
      });
    }

    if (!isEmployee) {
      return res.status(401).json({
        error: 'Você não possui autorização para fazer este tipo de ação!',
      });
    }

    const appointment = await Appointment.create(req.body);
    return res.json(appointment);
  }
}

export default new AppointmentController();
