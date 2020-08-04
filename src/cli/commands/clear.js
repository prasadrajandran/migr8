const down = require('./down');

const clear = async (migr8) => {
  const num = (await migr8.getExecutedMigrations()).length;
  return await down(migr8, num);
};

module.exports = clear;
