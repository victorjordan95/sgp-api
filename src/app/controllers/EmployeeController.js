import client from '../../database/db';

class EmployeeController {
  async index(req, res) {
    const {
      type,
      searchField
    } = req.query;

    const userEstabs = await client.query(
      `select estab.id from "establishment" as estab
      join user_establishment as uestab
      on estab.id = uestab.establishment_id
      where uestab.user_id = ${req.userId}`
    );

    if (!userEstabs) {
      return res.json([]);
    }

    let employees;
    if (type && searchField) {
      employees = await client.query(
        `select us.cpf, us.id, us.rg, us.name, us.email,
          r.role as rolename, e.name as estabName, e.id as estabid
          from "user" us
          left join user_establishment
          on us.id = user_establishment.user_id
          left join establishment e
          on e.id = user_establishment.establishment_id
          left join role r
          on us.role = r.id
          where lower(us.${type}) like lower('%' || unaccent('${searchField}') || '%')
          and user_establishment.establishment_id
          in (${JSON.stringify(userEstabs.rows.map(el => el.id))
            .replace('[', '')
            .replace(']', '')});`
      );
      return res.json(employees);
    }

    employees = await client.query(
      `select us.cpf, us.id, us.rg, us.name, us.email,
        r.role as rolename, e.name as estabName, e.id as estabid
        from "user" us
        left join user_establishment
        on us.id = user_establishment.user_id
        left join establishment e
        on e.id = user_establishment.establishment_id
        left join role r
        on us.role = r.id
        where user_establishment.establishment_id
        in (${JSON.stringify(userEstabs.rows.map(el => el.id))
          .replace('[', '')
          .replace(']', '')});`
    );
    return res.json(employees);
  }
}

export default new EmployeeController();
