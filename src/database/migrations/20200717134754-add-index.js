/* eslint-disable linebreak-style */
module.exports = {
  up: queryInterface => {
    return queryInterface.addIndex('cid', ['code', 'name']);
  },
  down: queryInterface => {
    return queryInterface.removeIndex('cid', ['code', 'name']);
  },
};
