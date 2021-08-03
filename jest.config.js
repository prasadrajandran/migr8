module.exports = async () => {
  return {
    watchPathIgnorePatterns: [
      '<rootDir>/tests/data/',
      '<rootDir>/tests/_workspace_',
      '<rootDir>/src/',
      '<rootDir>/docs/',
    ],
  };
};
