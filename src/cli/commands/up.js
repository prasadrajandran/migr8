const logger = require('../helpers/logger');
const findMaxStrLength = require('../helpers/find_max_str_length');

const up = async (migr8, num) => {
  const { migrations, err } = await migr8.up({ num });
  const padding = findMaxStrLength(migrations.map(({ batch }) => batch));

  for (const { name, batch } of migrations) {
    const status = `Migrated  Batch ${String(batch).padStart(padding, '0')}`;
    logger.inform(`${status}  ${name}`);
  }
  if (err) {
    logger.scream(err);
  } else if (!migrations.length) {
    logger.inform('Nothing to migrate.');
  }

  return err || true;
};

module.exports = up;
