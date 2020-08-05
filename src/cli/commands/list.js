const logger = require('../helpers/logger');
const findMaxStrLength = require('../helpers/find_max_length');

const list = async (migr8) => {
  const migrations = await migr8.getMigrations();
  const executedMigrations = await migr8.getExecutedMigrations();
  const padding = findMaxStrLength(migrations) + 2;

  for (const migration of await migr8.getMigrations()) {
    const executed = executedMigrations.find(({ name }) => migration === name);

    let status = '';
    if (executed) {
      status = `Migrated  Batch ${executed.batch}`;
    } else {
      status = 'Pending';
    }

    logger.inform(`${migration.padEnd(padding, ' ')}${status}`);
  }

  return true;
};

module.exports = list;
