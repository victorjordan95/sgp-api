import { literal, fn, Op, Sequelize } from 'sequelize';
import Address from '../models/Address';
import Contact from '../models/Contact';
import Establishment from '../models/Establishment';
import MedicineCategory from '../models/MedicineCategory';
import User from '../models/User';

class EstablishmentController {
  async index(req, res) {
    const { name = '' } = req.query;

    const attributes = [
      'id',
      'name',
      'has_bed',
      'amount_bed',
      'is_pharmacy',
      'is_public',
    ];

    const establishmentAttributes = [
      {
        model: Address,
        as: 'address_pk',
      },
      {
        model: Contact,
        attributes: ['phone', 'cellphone'],
      },
      {
        model: MedicineCategory,
        as: 'categories',
        attributes: ['name', 'id'],
        where: Sequelize.where(
          Sequelize.fn('unaccent', Sequelize.col('categories.name')),
          {
            [Op.iLike]: `%${name}%`,
          }
        ),
      },
    ];

    let establishment;
    if (req.query.userId) {
      const query = {
        attributes,
        include: [
          {
            model: Address,
            as: 'address_pk',
          },
          {
            model: MedicineCategory,
            as: 'categories',
            attributes: ['name', 'id'],
          },
          {
            model: User,
            as: 'users',
            attributes: ['id'],
            where: {
              id: req.query.userId,
            },
          },
        ],
        limit: 50,
        where: {
          status: true,
        },
      };
      establishment = await Establishment.findAndCountAll(query);
      return res.json(establishment);
    }

    if (req.params.id) {
      establishment = await Establishment.findByPk(req.params.id, {
        ...attributes,
        ...establishmentAttributes,
        include: [
          {
            model: Address,
            as: 'address_pk',
          },
          {
            model: Contact,
            attributes: ['phone', 'cellphone'],
          },
          {
            model: MedicineCategory,
            as: 'categories',
          },
        ],
        where: {
          status: true,
        },
      });
    } else {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const location = literal(`ST_GeomFromText('POINT(${lat} ${lng})', 4326)`);
      const distance = fn('ST_Distance_Sphere', literal('location'), location);

      const query = {
        attributes: [
          [fn('ST_Distance_Sphere', literal('location'), location), 'distance'],
          'id',
          'name',
          'has_bed',
          'amount_bed',
          'is_pharmacy',
          'is_public',
          'location',
        ],
        order: distance,
        include: establishmentAttributes,
        limit: 50,
        subQuery: false,
      };
      establishment = await Establishment.findAll(query);
    }

    return res.json(establishment);
  }

  async store(req, res) {
    const contactUser = await Contact.create(req.body);
    const addressUser = await Address.create(req.body);
    const [lat, lng] = req.body.geometry;
    const point = { type: 'Point', coordinates: [lat, lng] };

    const establishment = await Establishment.create({
      ...req.body,
      location: point,
      address: addressUser.id,
      contact: contactUser.id,
    });

    const { categories } = req.body;
    if (categories) {
      establishment.setCategories(categories);
    }

    return res.json(establishment);
  }

  async update(req, res) {
    const { cellphone, phone, id } = req.body;
    const { street, city, complement, country, number, state } = req.body;

    let lat;
    let lng;
    if (req.body.geometry) {
      [lat, lng] = req.body.geometry;
    }

    let establishment;
    if (id) {
      establishment = await Establishment.findByPk(id);
    }

    if (cellphone || phone) {
      const userContactUpdate = await Contact.findByPk(establishment.contact);
      await userContactUpdate.update(req.body);
    }

    if (street || city || complement || country || number || state) {
      const userAddressUpdate = await Address.findByPk(establishment.address);
      await userAddressUpdate.update(req.body);
    }
    let updatedEstab;
    if (lat && lng) {
      const point = { type: 'Point', coordinates: [lat, lng] };
      updatedEstab = await establishment.update({
        ...req.body,
        location: point,
      });
    } else {
      updatedEstab = await establishment.update(req.body);
    }

    const { categories } = req.body;
    if (categories) {
      establishment.setCategories(categories);
    }

    return res.json(updatedEstab);
  }

  async delete(req, res) {
    const estab = await Establishment.findByPk(req.params.id);
    await estab.update({ status: false });
    return res.status(201).json({
      message: `Estabelecimento ${estab.name} removido com sucesso`,
    });
  }
}

export default new EstablishmentController();
