const path = require('path');
const fs = require('fs');
const { Migr8 } = require('../d/migr8');
const {
  FileSystemRegistry,
} = require('../d/registry_drivers/file_system_registry');

const DATA_DIR = path.resolve(__dirname, 'data');
const WORKSPACE_DIR = path.resolve(__dirname, '_workspace_');
const MIGRATIONS_DIR = path.resolve(WORKSPACE_DIR, 'test_migrations');

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

const deleteMigrationsDir = () => {
  if (fs.existsSync(MIGRATIONS_DIR)) {
    fs.rmSync(MIGRATIONS_DIR, { recursive: true });
  }
};

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
  beforeEach(deleteMigrationsDir);

  test('returns a promise that resolves to a filename', async () => {
    const migr8 = new Migr8({
      migrationsDir: MIGRATIONS_DIR,
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

  afterAll(deleteTestWorkspaceDir);
});

describe('up() and down()', () => {
  const TOTAL_MIGRATIONS = 4;
  const TEST_OBJ_FILENAME = path.resolve(WORKSPACE_DIR, 'test_object.json');
  const testObjStates = [
    { x: 0 }, // Initial object state
    { x: 0, a: 5 }, // After migration 1
    { x: 0, b: 5 }, // After migration 2
    { x: 0, b: 5, r: 'r' }, // After migration 3
    { x: 0, b: 5, r: 'r', c: true }, // After migration 4
  ];

  const readTestObj = () => {
    return JSON.parse(
      fs.readFileSync(TEST_OBJ_FILENAME, {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  };

  const writeTestObj = (data) => {
    fs.writeFileSync(TEST_OBJ_FILENAME, JSON.stringify(data), {
      encoding: 'utf8',
      flag: 'w',
    });
  };

  const resetTestObj = () => {
    writeTestObj(testObjStates[0]);
  };

  const migr8 = new Migr8({
    migrationsDir: path.resolve(DATA_DIR, 'migrations'),
    registry: new FileSystemRegistry({ registryDir: WORKSPACE_DIR }),
    upArg: () => ({ readTestObj, writeTestObj }),
    downArg: () => ({ readTestObj, writeTestObj }),
  });

  beforeAll(() => {
    deleteTestWorkspaceDir();
    createTestWorkspaceDir();
    resetTestObj();
  });

  beforeEach(async () => {
    while ((await migr8.getPendingMigrations()).length !== TOTAL_MIGRATIONS) {
      await migr8.down();
    }
    expect((await migr8.getPendingMigrations()).length).toBe(TOTAL_MIGRATIONS);
    expect(readTestObj()).toStrictEqual(testObjStates[0]);
  });

  describe('up()', () => {
    test('runs all migrations successfully', async () => {
      await migr8.up();
      expect((await migr8.getPendingMigrations()).length).toBe(0);
      expect(readTestObj()).toStrictEqual(testObjStates[TOTAL_MIGRATIONS]);
    });

    [1, 2, 3, 4].forEach((num) => {
      test(`runs migration(s) 1 to ${num} successfully`, async () => {
        await migr8.up({ num });
        expect((await migr8.getPendingMigrations()).length).toBe(
          TOTAL_MIGRATIONS - num,
        );
        expect(readTestObj()).toStrictEqual(testObjStates[num]);
      });
    });
  });

  describe('down()', () => {
    test('rolledback all migrations successfully', async () => {
      await migr8.up();
      expect(readTestObj()).toStrictEqual(testObjStates[TOTAL_MIGRATIONS]);

      await migr8.down();
      expect(readTestObj()).toStrictEqual(testObjStates[0]);
    });

    [4, 3, 2, 1].forEach((num) => {
      test(`rolledback migrations ${num} to 4`, async () => {
        await migr8.up();
        expect(readTestObj()).toStrictEqual(testObjStates[TOTAL_MIGRATIONS]);

        await migr8.down({ num });
        expect(readTestObj()).toStrictEqual(
          testObjStates[TOTAL_MIGRATIONS - num],
        );
      });
    });
  });

  afterAll(deleteTestWorkspaceDir);
});

describe('getMigrations()', () => {
  test('returns an empty array if the folder does not exist', async () => {
    const migr8 = new Migr8();
    expect(await migr8.getMigrations()).toStrictEqual([]);
  });
});

describe('createFilename()', () => {
  test('returns a promise that resolves into a filename', () => {
    const migr8 = new Migr8();
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
});
