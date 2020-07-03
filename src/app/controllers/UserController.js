import * as Yup from 'yup';
import { Op } from 'sequelize';
import Address from '../models/Address';
import Contact from '../models/Contact';
import Roles from '../models/Roles';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const userAttributes = {
      attributes: [
        'id',
        'name',
        'email',
        'cpf',
        'rg',
        'address',
        'contact',
        'status',
      ],
      include: [
        {
          model: Roles,
          attributes: ['role'],
        },
        {
          model: Address,
          as: 'address_pk',
          attributes: [
            'street',
            'number',
            'complement',
            'city',
            'state',
            'country',
          ],
        },
      ],
    };

    let users;
    if (req.params.id) {
      users = await User.findByPk(req.params.id, userAttributes);
    } else {
      users = await User.findAll(userAttributes);
    }

    return res.json(users);
  }

  async store(req, res) {
    const { email, cpf, rg } = req.body;
    const userExists = await User.findOne({
      where: { [Op.or]: [{ email }, { cpf }, { rg }] },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const contactUser = await Contact.create(req.body);
    const addressUser = await Address.create(req.body);

    const user = await User.create({
      ...req.body,
      address: addressUser.id,
      contact: contactUser.id,
    });

    return res.json(user);
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;
    const { cellphone, phone } = req.body;
    const { street, city, complement, country, number, state } = req.body;

    let user;
    if (req.params.id) {
      user = await User.findByPk(req.params.id);
    } else {
      user = await User.findByPk(req.userId);
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (cellphone || phone) {
      const userContactUpdate = await Contact.findByPk(user.contact);
      await userContactUpdate.update(req.body);
    }

    if (street || city || complement || country || number || state) {
      const userAddressUpdate = await Address.findByPk(user.address);
      await userAddressUpdate.update(req.body);
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);
    return res.json({
      id,
      name,
    });
  }

  async delete(req, res) {
    const { id, role } = req.body;
    if (role !== 1 && id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ error: 'Não permitido.' });
    }
    const user = await User.findByPk(req.params.id);
    await user.update({ status: false });
    return res
      .status(201)
      .json({ message: `Usuário ${user.name} desabilitado com sucesso` });
  }
}

export default new UserController();
