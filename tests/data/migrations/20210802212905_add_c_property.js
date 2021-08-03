/**
 * Execute migration.
 *
 * @param {Object} arg
 * @returns {Promise<void>}
 */
exports.up = async ({ readTestObj, writeTestObj }) => {
  const testObj = readTestObj();
  testObj.c = true;
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
  delete testObj.c;
  writeTestObj(testObj);
};
