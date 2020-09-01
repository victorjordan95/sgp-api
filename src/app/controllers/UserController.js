import { Op } from 'sequelize';
import Address from '../models/Address';
import Contact from '../models/Contact';
import Doctor from '../models/Doctor';
import Establishment from '../models/Establishment';
import File from '../models/File';
import MedicineCategory from '../models/MedicineCategory';
import Roles from '../models/Roles';
import ProfessionalCoucil from '../models/ProfessionalCoucil';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const userAttributes = {
      attributes: ['id', 'name', 'email', 'cpf', 'rg', 'status', 'role'],
      include: [
        {
          model: Roles,
          attributes: ['role', 'id'],
        },
        {
          model: Doctor,
          as: 'doctor_info',
          include: [
            {
              model: ProfessionalCoucil,
            },
            {
              model: MedicineCategory,
              as: 'categories',
            },
          ],
        },
        {
          model: Address,
          as: 'address_pk',
          attributes: [
            'full_address',
            'street',
            'number',
            'complement',
            'city',
            'state',
            'zipcode',
            'locale',
            'neighborhood',
            'country',
          ],
        },
        {
          model: Contact,
          attributes: ['phone', 'cellphone'],
        },
        {
          model: File,
          as: 'avatar',
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
    let lat;
    let lng;
    let point;
    if (req.body.geometry) {
      [lat, lng] = req.body.geometry;
      point = { type: 'Point', coordinates: [lat, lng] };
    }

    const { email, cpf, rg } = req.body;
    const userExists = await User.findOne({
      where: { [Op.or]: [{ email }, { cpf }, { rg }] },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const contactUser = await Contact.create(req.body);
    const addressUser = await Address.create({ ...req.body, locale: point });

    const { establishments, ...data } = req.body;
    const user = await User.create({
      ...req.body,
      address: addressUser.id,
      contact: contactUser.id,
    });

    if (establishments) {
      user.setEstablishments(establishments);
    }

    return res.json(user);
  }

  async update(req, res) {
    let lat;
    let lng;
    let point;
    if (req.body.geometry) {
      [lat, lng] = req.body.geometry;
      point = { type: 'Point', coordinates: [lat, lng] };
    }
    const { email, oldPassword, avatar_id } = req.body;
    const { cellphone, phone } = req.body;
    const {
      street,
      city,
      complement,
      country,
      number,
      state,
      zipcode,
    } = req.body;
    const {
      time_appointment,
      categories,
      coucil_number,
      endHour,
      professional_coucil,
      start_hour,
    } = req.body;

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

    if (
      street ||
      city ||
      complement ||
      country ||
      number ||
      state ||
      zipcode ||
      lat ||
      lng
    ) {
      const userAddressUpdate = await Address.findByPk(user.address);
      await userAddressUpdate.update({ ...req.body, locale: point });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    let updatedDoc;
    if (
      time_appointment ||
      categories ||
      coucil_number ||
      endHour ||
      professional_coucil ||
      start_hour
    ) {
      const doctorInfo = await Doctor.findByPk(user.doctor);
      if (doctorInfo) {
        updatedDoc = await doctorInfo.update(req.body);
      } else {
        updatedDoc = await Doctor.create(req.body);
      }
      if (categories) {
        updatedDoc.setCategories(categories);
      }
    }

    const { establishments, ...data } = req.body;
    const createdUser = await user.update({
      ...data,
      doctor: (updatedDoc && updatedDoc.id) || null,
    });

    if (establishments) {
      createdUser.setEstablishments(establishments);
    }

    return res.json(createdUser);
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
