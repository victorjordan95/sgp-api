import {
  startOfMonth,
  lastDayOfMonth,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';

import client from '../../database/db';

class DashboardController {
  async indexYear(req, res) {
    const {
      estab
    } = req.query;

    const {
      rows
    } = await client.query(
      `select count(ap.id), TO_CHAR(ap.start::DATE, 'MM-YYYY') as name, establishment_id
      from appointment ap
      where establishment_id = ${estab}
      and status = 5
      group by name, establishment_id
      order by name asc
      limit 12`
    );

    const data = rows.map(el => {
      return {
        ...el,
        Consultas: Number(el.count),
      };
    });
    return res.json(data);
  }

  async appointmentsDay(req, res) {
    const {
      estab
    } = req.query;

    const newDate = new Date();

    const done = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      AND start <  '${format(endOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      and status = 5
      group by  establishment_id`
    );

    const cancelled = await client.query(
      `SELECT count(ap.id), establishment_id
      FROM appointment ap
      WHERE establishment_id = ${estab}
      AND start >= '${format(startOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      AND start <  '${format(endOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      AND status = 3
      GROUP BY establishment_id`
    );

    const scheduled = await client.query(
      `SELECT count(ap.id), establishment_id
      FROM appointment ap
      WHERE establishment_id = ${estab}
      AND start >= '${format(startOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      AND start <  '${format(endOfDay(newDate), 'dd-MM-yyyy HH:mm')}'
      AND status = 2
      GROUP BY establishment_id`
    );

    const dataScheduled = scheduled.rows.map(el => {
      return {
        ...el,
        name: 'Agendadas',
        value: Number(el.count),
        color: '#03a9f4',
      };
    });

    const dataDone = done.rows.map(el => {
      return {
        ...el,
        name: 'Realizadas',
        value: Number(el.count),
        color: '#8884d8'
      };
    });
    const dataCancelled = cancelled.rows.map(el => {
      return {
        ...el,
        name: 'Canceladas',
        value: Number(el.count),
        color: '#f44336',
      };
    });
    return res.json([...dataDone, ...dataCancelled, ...dataScheduled]);
  }

  async appointmentsMonth(req, res) {
    const newDate = new Date();
    const {
      estab
    } = req.query;

    const done = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfMonth(newDate), 'dd-MM-yyyy')}'
      AND start <  '${format(lastDayOfMonth(newDate), 'dd-MM-yyyy')}'
      and status = 5
      group by  establishment_id`
    );

    const scheduled = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfMonth(newDate), 'dd-MM-yyyy')}'
      AND start <  '${format(lastDayOfMonth(newDate), 'dd-MM-yyyy')}'
      AND status = 2
      group by  establishment_id`
    );

    const cancelled = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfMonth(newDate), 'dd-MM-yyyy')}'
      AND start <  '${format(lastDayOfMonth(newDate), 'dd-MM-yyyy')}'
      and status = 3
      group by  establishment_id`
    );

    const dataDone = done.rows.map(el => {
      return {
        ...el,
        name: 'Realizadas',
        value: Number(el.count),
        color: '#8884d8'
      };
    });

    const dataScheduled = scheduled.rows.map(el => {
      return {
        ...el,
        name: 'Agendadas',
        value: Number(el.count),
        color: '#03a9f4',
      };
    });
    const dataCancelled = cancelled.rows.map(el => {
      return {
        ...el,
        name: 'Canceladas',
        value: Number(el.count),
        color: '#f44336',
      };
    });
    return res.json([...dataDone, ...dataCancelled, ...dataScheduled]);
  }
}

export default new DashboardController();
