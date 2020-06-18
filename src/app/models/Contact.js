import Sequelize, { Model } from 'sequelize';

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        phone: Sequelize.STRING,
        cellphone: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'contact',
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'contact', as: 'user_contact' });
  }
}

export default Contact;
