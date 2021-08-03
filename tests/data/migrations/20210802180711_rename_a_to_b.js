/**
 * Execute migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.up = async ({ readTestObj, writeTestObj }) => {
  const testObj = readTestObj();
  testObj.b = testObj.a;
  delete testObj.a;
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
  testObj.a = testObj.b;
  delete testObj.b;
  writeTestObj(testObj);
};
