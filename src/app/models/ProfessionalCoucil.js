import Sequelize, { Model } from 'sequelize';

class ProfessionalCoucil extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'professional_coucil',
      }
    );

    return this;
  }
}
export default ProfessionalCoucil;
