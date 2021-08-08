const path = require('path');
const fs = require('fs');
const { Migr8 } = require('../d/migr8');
const {
  FileSystemRegistry,
} = require('../d/registry_drivers/file_system_registry');
const { RESERVED_CHARACTERS } = require('../d/helpers/sanitize_filename');
const {
  DATA_DIR,
  DATA_TOTAL_MIGRATIONS,
  DATA_MIGRATION_OBJ_STATES,
  WORKSPACE_DIR,
  WORKSPACE_MIGRATIONS_DIR,
  deleteTestWorkspaceDir,
  createTestWorkspaceDir,
  deleteWorkspaceMigrationsDir,
  writeTestMigrationObj,
  readTestMigrationObj,
  resetTestMigrationObj,
} = require('./helpers/common');

describe('constructor()', () => {
  test('constructor args are optional', () => {
    expect(() => new Migr8()).not.toThrow();
    expect(() => new Migr8({})).not.toThrow();
  });

  test('"migrations" is the default migrations directory', () => {
    const migr8 = new Migr8();
    expect(migr8.migrationsDir).toBe(path.resolve(process.cwd(), 'migrations'));
  });

  test('FileSystemDriver is the default Registry driver', () => {
    const migr8 = new Migr8();
    expect(migr8.registry).toBeInstanceOf(FileSystemRegistry);
  });

  test('upArg defaults to an empty async function', async () => {
    const migr8 = new Migr8();
    return expect(migr8.upArg()).resolves.toBe(undefined);
  });

  test('downArg defaults to an empty async function', async () => {
    const migr8 = new Migr8();
    return expect(migr8.downArg()).resolves.toBe(undefined);
  });

  test('paths are relative to cwd', () => {
    const migr8 = new Migr8();
    const cwd = process.cwd();
    expect(migr8.migrationsDir).toBe(path.resolve(cwd, 'migrations'));
    expect(migr8.registry.registryFilename).toBe(
      path.resolve(cwd, 'migr8.registry.json'),
    );
  });
});

describe('create()', () => {
  beforeEach(deleteWorkspaceMigrationsDir);
  afterAll(deleteTestWorkspaceDir);

  test('returns a promise that resolves to a filename', async () => {
    const migr8 = new Migr8({
      migrationsDir: WORKSPACE_MIGRATIONS_DIR,
    });

    const names = ['something', 'else', 'dummy'];

    for (const name of names) {
      const filename = await migr8.createFilename(name);

      // Migrations directory should not exist at the start
      expect(fs.existsSync(filename)).toBe(false);

      migr8.create(name).then((migrationName) => {
        expect(migrationName).toBe(filename);
        expect(fs.existsSync(filename)).toBe(true);
      });
    }
  });

  test('uses a custom template if provided one', async () => {
    const templateFilename = path.resolve(
      DATA_DIR,
      'custom_migration_template.js',
    );

    const migr8 = new Migr8({
      migrationsDir: path.resolve(WORKSPACE_DIR, 'migrations'),
      templateFilename,
    });

    const name = 'dummy';
    const migrationFilename = await migr8.createFilename(name);
    await migr8.create(name);

    expect(fs.readFileSync(migrationFilename, { encoding: 'utf8' })).toBe(
      fs.readFileSync(templateFilename, { encoding: 'utf8' }),
    );
  });
});

describe('up() and down()', () => {
  const migr8 = new Migr8({
    migrationsDir: path.resolve(DATA_DIR, 'migrations'),
    registry: new FileSystemRegistry({ registryDir: WORKSPACE_DIR }),
    upArg: () => ({ readTestMigrationObj, writeTestMigrationObj }),
    downArg: () => ({ readTestMigrationObj, writeTestMigrationObj }),
  });

  beforeAll(() => {
    deleteTestWorkspaceDir();
    createTestWorkspaceDir();
    resetTestMigrationObj();
  });

  beforeEach(async () => {
    while (
      (await migr8.getPendingMigrations()).length !== DATA_TOTAL_MIGRATIONS
    ) {
      await migr8.down();
    }
    expect((await migr8.getPendingMigrations()).length).toBe(
      DATA_TOTAL_MIGRATIONS,
    );
    expect(readTestMigrationObj()).toStrictEqual(DATA_MIGRATION_OBJ_STATES[0]);
  });

  afterAll(deleteTestWorkspaceDir);

  describe('up()', () => {
    test('runs all migrations successfully', async () => {
      await migr8.up();
      expect((await migr8.getPendingMigrations()).length).toBe(0);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );
    });

    [1, 2, 3, 4].forEach((num) => {
      test(`runs migration(s) 1 to ${num} successfully`, async () => {
        await migr8.up({ num });
        expect((await migr8.getPendingMigrations()).length).toBe(
          DATA_TOTAL_MIGRATIONS - num,
        );
        expect(readTestMigrationObj()).toStrictEqual(
          DATA_MIGRATION_OBJ_STATES[num],
        );
      });
    });
  });

  describe('down()', () => {
    test('rolled back all migrations successfully', async () => {
      await migr8.up();
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );

      await migr8.down();
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[0],
      );
    });

    [4, 3, 2, 1].forEach((num) => {
      test(`rolled back migrations ${num} to 4`, async () => {
        await migr8.up();
        expect(readTestMigrationObj()).toStrictEqual(
          DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
        );

        await migr8.down({ num });
        expect(readTestMigrationObj()).toStrictEqual(
          DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - num],
        );
      });
    });
  });
});

describe('getMigrations()', () => {
  test('returns an empty array if the folder does not exist', async () => {
    const migr8 = new Migr8();
    expect(await migr8.getMigrations()).toStrictEqual([]);
  });
});

describe('createFilename()', () => {
  const migr8 = new Migr8();

  test('returns a promise that resolves into a filename', () => {
    const name = 'something';
    const timestamp = new Date()
      .toISOString()
      .replace(/[^\d]/g, '')
      .substring(0, 14);
    const expectedFilename = `${timestamp}_${name}.js`;
    return expect(migr8.createFilename(name)).resolves.toBe(
      path.resolve(migr8.migrationsDir, expectedFilename),
    );
  });

  RESERVED_CHARACTERS.forEach((char) => {
    test(`sanitizes "${char}" from the migration's filename`, () => {
      return expect(migr8.createFilename(char)).resolves.toMatch(/_\.js$/);
    });
  });
});
