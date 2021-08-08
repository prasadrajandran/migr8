const path = require('path');
const fs = require('fs');

const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_MIGRATIONS_DIR = path.resolve(__dirname, '../data/migrations');
const DATA_CUSTOM_MIGRATION_TEMPLATE = path.resolve(
  __dirname,
  '../data/custom_migration_template.js',
);
const DATA_TOTAL_MIGRATIONS = 4;
const DATA_MIGRATION_OBJ_STATES = Object.freeze([
  { x: 0 }, // Initial object state
  { x: 0, a: 5 }, // After migration 1
  { x: 0, b: 5 }, // After migration 2
  { x: 0, b: 5, r: 'r' }, // After migration 3
  { x: 0, b: 5, r: 'r', c: true }, // After migration 4
]);

const WORKSPACE_DIR = path.resolve(__dirname, '../_workspace_');
const WORKSPACE_MIGRATIONS_DIR = path.resolve(WORKSPACE_DIR, 'test_migrations');
const WORKSPACE_TEST_MIGRATION_OBJ_FILENAME = path.resolve(
  WORKSPACE_DIR,
  'test_object.json',
);

const deleteTestWorkspaceDir = () => {
  if (fs.existsSync(WORKSPACE_DIR)) {
    fs.rmSync(WORKSPACE_DIR, { recursive: true });
  }
};

const createTestWorkspaceDir = () => {
  if (!fs.existsSync(WORKSPACE_DIR)) {
    fs.mkdirSync(WORKSPACE_DIR);
  }
};

const deleteWorkspaceMigrationsDir = () => {
  if (fs.existsSync(WORKSPACE_MIGRATIONS_DIR)) {
    fs.rmSync(WORKSPACE_MIGRATIONS_DIR, { recursive: true });
  }
};

const writeTestMigrationObj = (data) => {
  fs.writeFileSync(
    WORKSPACE_TEST_MIGRATION_OBJ_FILENAME,
    JSON.stringify(data),
    {
      encoding: 'utf8',
      flag: 'w',
    },
  );
};

const readTestMigrationObj = () => {
  return JSON.parse(
    fs.readFileSync(WORKSPACE_TEST_MIGRATION_OBJ_FILENAME, {
      encoding: 'utf8',
      flag: 'r',
    }),
  );
};

const resetTestMigrationObj = () => {
  writeTestMigrationObj(DATA_MIGRATION_OBJ_STATES[0]);
};

module.exports.DATA_DIR = DATA_DIR;
module.exports.DATA_MIGRATIONS_DIR = DATA_MIGRATIONS_DIR;
module.exports.DATA_CUSTOM_MIGRATION_TEMPLATE = DATA_CUSTOM_MIGRATION_TEMPLATE;
module.exports.DATA_TOTAL_MIGRATIONS = DATA_TOTAL_MIGRATIONS;
module.exports.DATA_MIGRATION_OBJ_STATES = DATA_MIGRATION_OBJ_STATES;
module.exports.WORKSPACE_DIR = WORKSPACE_DIR;
module.exports.WORKSPACE_MIGRATIONS_DIR = WORKSPACE_MIGRATIONS_DIR;
module.exports.deleteTestWorkspaceDir = deleteTestWorkspaceDir;
module.exports.createTestWorkspaceDir = createTestWorkspaceDir;
module.exports.deleteWorkspaceMigrationsDir = deleteWorkspaceMigrationsDir;
module.exports.writeTestMigrationObj = writeTestMigrationObj;
module.exports.readTestMigrationObj = readTestMigrationObj;
module.exports.resetTestMigrationObj = resetTestMigrationObj;
