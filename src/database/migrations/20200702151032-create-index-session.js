/* eslint-disable linebreak-style */
module.exports = {
  up: queryInterface => {
    return queryInterface.addIndex('session', ['session_token']);
  },
  down: queryInterface => {
    return queryInterface.removeIndex('session', ['session_token']);
  },
};
