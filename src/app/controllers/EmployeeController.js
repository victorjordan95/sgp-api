import client from '../../database/db';

class EmployeeController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const { type, searchField } = req.query;
    // const AMOUNT_PAGE = 10;

    const userEstabs = await client.query(
      `select estab.id from "establishment" as estab
      join user_establishment as uestab
      on estab.id = uestab.establishment_id
      where uestab.user_id = ${req.userId}`
    );

    if (!userEstabs) {
      return res.json([]);
    }

    let estabs;
    if (type && searchField) {
      estabs = await client.query(
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
      return res.json(estabs);
    }

    estabs = await client.query(
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
    // const hasNextPage = AMOUNT_PAGE * page < estabs.count;
    // const hasPreviousPage = page > 1;
    return res.json(estabs);
  }
}

export default new EmployeeController();
