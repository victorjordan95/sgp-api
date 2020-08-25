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
    client.connect();
    const { estab } = req.query;

    const { rows } = await client.query(
      `select count(ap.id), TO_CHAR(ap.start::DATE, 'MM-YYYY') as name, establishment_id
      from appointment ap
      where establishment_id = ${estab}
      and status = 5
      group by name, establishment_id
      order by name asc
      limit 12`
    );
    client.end();

    const data = rows.map(el => {
      return {
        ...el,
        Consultas: Number(el.count),
      };
    });
    return res.json(data);
  }

  async appointmentsDay(req, res) {
    const { estab } = req.query;

    client.connect();
    const done = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfDay(new Date()), 'dd-MM-yyyy HH:mm')}'
      AND start <  '${format(endOfDay(new Date()), 'dd-MM-yyyy HH:mm')}'
      and status = 5
      group by  establishment_id`
    );

    const cancelled = await client.query(
      `SELECT count(ap.id), establishment_id
      FROM appointment ap
      WHERE establishment_id = ${estab}
      AND start >= '${format(startOfDay(new Date()), 'dd-MM-yyyy HH:mm')}'
      AND start <  '${format(endOfDay(new Date()), 'dd-MM-yyyy HH:mm')}'
      AND status = 3
      GROUP BY establishment_id`
    );

    const dataDone = done.rows.map(el => {
      return {
        ...el,
        name: 'Realizadas',
        value: Number(el.count),
      };
    });
    const dataCancelled = cancelled.rows.map(el => {
      return {
        ...el,
        name: 'Canceladas',
        value: Number(el.count),
      };
    });
    client.end();
    return res.json([...dataDone, ...dataCancelled]);
  }

  async appointmentsMonth(req, res) {
    const { estab } = req.query;
    client.connect();

    const done = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfMonth(new Date()), 'dd-MM-yyyy')}'
      AND start <  '${format(lastDayOfMonth(new Date()), 'dd-MM-yyyy')}'
      and status = 5
      group by  establishment_id`
    );

    const cancelled = await client.query(
      `select count(ap.id), establishment_id
      from appointment ap
      where establishment_id = ${estab}
      AND start >= '${format(startOfMonth(new Date()), 'dd-MM-yyyy')}'
      AND start <  '${format(lastDayOfMonth(new Date()), 'dd-MM-yyyy')}'
      and status = 3
      group by  establishment_id`
    );

    const dataDone = done.rows.map(el => {
      return {
        ...el,
        name: 'Realizadas',
        value: Number(el.count),
      };
    });
    const dataCancelled = cancelled.rows.map(el => {
      return {
        ...el,
        name: 'Canceladas',
        value: Number(el.count),
      };
    });
    client.end();
    return res.json([...dataDone, ...dataCancelled]);
  }
}

export default new DashboardController();
