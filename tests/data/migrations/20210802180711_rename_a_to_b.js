/**
 * Execute migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.up = async ({ readTestMigrationObj, writeTestMigrationObj }) => {
  const testObj = readTestMigrationObj();
  testObj.b = testObj.a;
  delete testObj.a;
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
  testObj.a = testObj.b;
  delete testObj.b;
  writeTestMigrationObj(testObj);
};
