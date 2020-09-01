import Sequelize, { Model } from 'sequelize';

class ProfessionalCoucil extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        label: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.name;
          },
        },
        value: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.id;
          },
        },
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
