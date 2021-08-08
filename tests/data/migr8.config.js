const {
  DATA_MIGRATIONS_DIR,
  readTestMigrationObj,
  writeTestMigrationObj,
} = require('../helpers/common');

module.exports = {
  migrationsDir: DATA_MIGRATIONS_DIR,
  upArg: () => ({ readTestMigrationObj, writeTestMigrationObj }),
  downArg: () => ({ readTestMigrationObj, writeTestMigrationObj }),
};
