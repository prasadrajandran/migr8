const up = require('./up');
const clear = require('./clear');

const reset = async (migr8) => {
  if ((await clear(migr8)) === true) {
    await up(migr8);
  }
};

module.exports = reset;
