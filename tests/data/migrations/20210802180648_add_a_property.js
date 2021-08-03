/**
 * Execute migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.up = async ({ readTestObj, writeTestObj }) => {
  const testObj = readTestObj();
  testObj.a = 5;
  writeTestObj(testObj);
};

/**
 * Rollback migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.down = async ({ readTestObj, writeTestObj }) => {
  const testObj = readTestObj();
  delete testObj.a;
  writeTestObj(testObj);
};
