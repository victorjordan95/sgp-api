/* eslint-disable linebreak-style */

module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('address', 'location', 'locale');
  },
};
