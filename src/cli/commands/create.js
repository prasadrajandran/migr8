const logger = require('../helpers/logger');

const create = async (migr8, migrationName) => {
  if (!migrationName) {
    logger.warn('A name is required to create a migration.');
    return;
  }
  logger.inform(`Created "${await migr8.create(migrationName)}"`);

  return true;
};

module.exports = create;
