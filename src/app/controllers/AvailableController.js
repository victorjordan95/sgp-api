import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AvailableController {
  async index(req, res) {
    const { date = new Date() } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        doctor_id: req.params.doctorId,
        canceled_at: null,
        start: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
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

    const schedule = [
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        title:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.start, 'HH:mm') === time)
            ? 'Disponível'
            : 'Não disponível',
        time,
        start: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        end: format(setMinutes(value, 30), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.start, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
