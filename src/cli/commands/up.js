const logger = require('../helpers/logger');
const findMaxLength = require('../helpers/find_max_length');

const up = async (migr8, num) => {
  const { migrations, err } = await migr8.up({ num });
  const padding = findMaxLength(migrations.map(({ name }) => name)) + 2;

  for (const { name, batch } of migrations) {
    const status = `Migrated  Batch ${batch}`;
    logger.inform(`${name.padEnd(padding, ' ')}${status}`);
  }
  if (err) {
    logger.scream(err);
  } else if (!migrations.length) {
    logger.inform('Nothing to migrate.');
  }

  return err || true;
};

module.exports = up;
