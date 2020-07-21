import Address from '../models/Address';
import Contact from '../models/Contact';
import Establishment from '../models/Establishment';
import MedicineCategory from '../models/MedicineCategory';

class EstablishmentController {
  async index(req, res) {
    const userAttributes = {
      attributes: ['id', 'name', 'has_bed', 'amount_bed', 'is_pharmacy'],
      include: [
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
        {
          model: Contact,
          attributes: ['phone', 'cellphone'],
        },
        {
          model: MedicineCategory,
          as: 'categories',
          attributes: ['name', 'id'],
        },
      ],
    };
    let establishment;
    if (req.params.id) {
      establishment = await Establishment.findByPk(
        req.params.id,
        userAttributes
      );
    } else {
      establishment = await Establishment.findAll(userAttributes);
    }

    return res.json(establishment);
  }

  async store(req, res) {
    const contactUser = await Contact.create(req.body);
    const addressUser = await Address.create(req.body);

    const { categories } = req.body;

    const establishment = await Establishment.create({
      ...req.body,
      address: addressUser.id,
      contact: contactUser.id,
    });

    if (categories) {
      establishment.setCategories(categories);
    }

    return res.json(establishment);
  }

  async update(req, res) {
    const { cellphone, phone } = req.body;
    const { street, city, complement, country, number, state } = req.body;

    let establishment;
    if (req.params.id) {
      establishment = await Establishment.findByPk(req.params.id);
    }

    if (cellphone || phone) {
      const userContactUpdate = await Contact.findByPk(establishment.contact);
      await userContactUpdate.update(req.body);
    }

    if (street || city || complement || country || number || state) {
      const userAddressUpdate = await Address.findByPk(establishment.address);
      await userAddressUpdate.update(req.body);
    }

    const { id, name } = await establishment.update(req.body);
    const { categories } = req.body;

    if (categories) {
      establishment.setMedicineCategories(categories);
    }

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
    const estab = await Establishment.findByPk(req.params.id);
    await estab.destroy({ status: false });
    return res.status(201).json({
      message: `Estabelecimento ${estab.name} removido com sucesso`,
    });
  }
}

export default new EstablishmentController();
