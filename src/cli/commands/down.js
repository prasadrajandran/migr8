const logger = require('../helpers/logger');
const findMaxStrLength = require('../helpers/find_max_str_length');

const down = async (migr8, num) => {
  const { migrations, err } = await migr8.down({ num });
  const padding = findMaxStrLength(migrations.map(({ name }) => name)) + 2;

  for (const { name, batch } of migrations) {
    const status = `Rollbacked  Batch ${batch}`;
    logger.inform(`${name.padEnd(padding, ' ')}${status}`);
  }
  if (err) {
    logger.scream(err);
  } else if (!migrations.length) {
    logger.inform('Nothing to rollback.');
  }

  return err || true;
};

module.exports = down;
