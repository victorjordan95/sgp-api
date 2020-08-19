import User from '../models/User';
import Roles from '../models/Roles';

import RoleEnum from '../enums/Roles.enum';

export default async (req, res, next) => {
  const isAdmin = await User.findOne({
    where: { id: req.userId },
    include: [
      {
        model: Roles,
        attributes: ['role'],
        where: { role: RoleEnum.ADMIN },
      },
    ],
  });

  if (!isAdmin) {
    return res
      .status(401)
      .json({ error: 'Você não tem permissão para concluir essa ação!' });
  }

  return next();
};
