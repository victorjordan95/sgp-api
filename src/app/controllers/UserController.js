import Address from '../models/Address';
import Contact from '../models/Contact';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const contactUser = await Contact.create({
      phone: req.body.phone,
      cellphone: req.body.cellphone,
    });

    const addressUser = await Address.create({
      street: req.body.street,
      city: req.body.city,
      complmenet: req.body.complement,
      country: req.body.country,
      number: req.body.number,
      state: req.body.state,
    });

    const user = await User.create({
      cpf: req.body.cpf,
      rg: req.body.rg,
      email: req.body.email,
      name: req.body.name,
      password_hash: req.body.password_hash,
      role: req.body.role,
      address: addressUser.id,
    });

    return res.json(user);
  }
}

export default new UserController();
