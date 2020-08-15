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
  addMinutes,
  addHours,
  getMinutes,
  getHours,
} from 'date-fns';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import User from '../models/User';

class AvailableController {
  async index(req, res) {
    const { date = new Date() } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const doctor = await User.findByPk(req.params.doctorId, {
      include: [
        {
          model: Doctor,
          as: 'doctor_info',
          attributes: ['start_hour', 'end_hour', 'time_appointment'],
        },
      ],
    });

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
          attributes: ['name', 'doctor'],
        },
      ],
    });

    const startAp = doctor.dataValues.doctor_info.dataValues.start_hour;
    const endAp = doctor.dataValues.doctor_info.dataValues.end_hour;
    const intervalAp =
      doctor.dataValues.doctor_info.dataValues.time_appointment;

    const valueStart = setSeconds(
      setMinutes(
        setHours(new Date(), startAp.split(':')[0]),
        startAp.split(':')[1]
      ),
      0
    );

    const valueEnd = setSeconds(
      setMinutes(
        setHours(new Date(), endAp.split(':')[0]),
        endAp.split(':')[1]
      ),
      0
    );

    const [hourInter, minuteInter] = intervalAp.split(':');

    let schedule = [];
    let startDateList = valueStart;

    while (startDateList < valueEnd) {
      schedule = [
        ...schedule,
        `${
          getHours(startDateList) < 10
            ? `0${getHours(startDateList)}`
            : getHours(startDateList)
        }:${
          getMinutes(startDateList) < 10
            ? `0${getMinutes(startDateList)}`
            : getMinutes(startDateList)
        }`,
      ];
      startDateList = addHours(
        addMinutes(startDateList, minuteInter),
        hourInter
      );
    }

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
        end: format(
          addMinutes(addHours(value, hourInter), minuteInter),
          "yyyy-MM-dd'T'HH:mm:ssxxx"
        ),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.start, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
