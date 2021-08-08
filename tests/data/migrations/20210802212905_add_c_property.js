/**
 * Execute migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.up = async ({ readTestMigrationObj, writeTestMigrationObj }) => {
  const testObj = readTestMigrationObj();
  testObj.c = true;
  writeTestMigrationObj(testObj);
};

/**
 * Roll back migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.down = async ({ readTestMigrationObj, writeTestMigrationObj }) => {
  const testObj = readTestMigrationObj();
  delete testObj.c;
  writeTestMigrationObj(testObj);
};
