import jwt from 'jsonwebtoken';
import User from '../models/User';
import Session from '../models/Session';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Credenciais não encontradas' });
    }

    const { id, name } = user;

    const sessionToken = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expires,
    });

    const userToken = await Session.findOne({ where: { user_id: id } });

    if (userToken) {
      await userToken.update({
        session_token: sessionToken,
        user_id: id,
      });
    } else {
      await Session.create({
        session_token: sessionToken,
        user_id: id,
      });
    }

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: sessionToken,
    });
  }

  async index(req, res) {
    const { session_token } = req.body;
    const sessionUser = await Session.findOne({ where: { session_token } });
    return res.json({
      sessionUser,
    });
  }

  async delete(req, res) {
    const result = await Session.destroy({
      where: { session_token: req.params.token },
    });
    return res.json(result);
  }
}

export default new SessionController();
