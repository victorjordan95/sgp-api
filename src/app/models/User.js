import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cpf: Sequelize.STRING,
        rg: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.Address, {
      foreignKey: 'address',
      as: 'address_pk',
    });

    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });

    this.belongsTo(models.Roles, { foreignKey: 'role' });
    this.belongsTo(models.Contact, { foreignKey: 'contact' });
    this.hasOne(models.Session, { foreignKey: 'user_id' });

    this.belongsToMany(models.Establishment, {
      through: 'user_establishment',
      as: 'establishments',
      foreignKey: 'user_id',
    });
  }
}

export default User;
