const logger = require('../helpers/logger');
const findMaxStrLength = require('../helpers/find_max_str_length');

const list = async (migr8) => {
  const executedMigrations = await migr8.getExecutedMigrations();
  const padding = findMaxStrLength(
    executedMigrations.map(({ batch }) => batch),
  );

  for (const migration of await migr8.getMigrations()) {
    const executed = executedMigrations.find(({ name }) => migration === name);

    let status = '';
    if (executed) {
      String(executed.batch).padStart(padding, '0');
      status = `Migrated  Batch ${String(executed.batch).padStart(
        padding,
        '0',
      )}`;
    } else {
      status = 'Pending';
    }

    logger.inform(`${status}  ${migration}`);
  }

  return true;
};

module.exports = list;
