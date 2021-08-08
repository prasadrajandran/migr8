module.exports = async () => {
  return {
    watchPathIgnorePatterns: [
      '<rootDir>/tests/_workspace_',
      '<rootDir>/src/',
      '<rootDir>/docs/',
    ],
  };
};
