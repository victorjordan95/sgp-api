import { Op } from 'sequelize';
import { startOfMonth, lastDayOfMonth } from 'date-fns';
import Appointment from '../models/Appointment';
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
            role: RoleEnum.DOCTOR,
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
        date: {
          [Op.between]: [
            startOfMonth(formattedDate),
            lastDayOfMonth(formattedDate),
          ],
        },
      },
      order: ['date'],
      attributes: ['id', 'date', 'patient_id'],
    });

    // const role = await Roles.create(req.body);
    return res.json(appointments);
  }
}

export default new ScheduleController();
