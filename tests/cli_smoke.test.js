const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const pkg = require('../package.json');
const {
  DATA_DIR,
  DATA_MIGRATIONS_DIR,
  DATA_MIGRATION_OBJ_STATES,
  DATA_TOTAL_MIGRATIONS,
  WORKSPACE_DIR,
  WORKSPACE_MIGRATIONS_DIR,
  deleteTestWorkspaceDir,
  createTestWorkspaceDir,
  readTestMigrationObj,
  resetTestMigrationObj,
} = require('./helpers/common');

const CLI = path.resolve(__dirname, '../dist/cli.js');
const COLOR_CODES = /\x1b\[\d{1,2}m/g;

const getManPage = (cmd = '') => {
  return fs
    .readFileSync(
      path.resolve(
        __dirname,
        `../src/man_pages/${cmd ? `${cmd}_` : ''}man.txt`,
      ),
      {
        encoding: 'utf8',
      },
    )
    .replace(COLOR_CODES);
};

const MAN_PAGE = getManPage();

const CMD_MAN_PAGES = Object.freeze({
  create: getManPage('create'),
  up: getManPage('up'),
  down: getManPage('down'),
  list: getManPage('list'),
  clear: getManPage('clear'),
  reset: getManPage('reset'),
});

const VERSION = `${pkg.name}: ${pkg.version}`;

const cli = (args, cwd = DATA_DIR) => {
  try {
    return execSync(`node ${CLI} ${args}`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd,
    }).replace(COLOR_CODES, '');
  } catch (e) {
    return e;
  }
};

describe('options', () => {
  describe('--help', () => {
    test('prints out man page', () => {
      expect(cli('--help')).toBe(`${MAN_PAGE}\n`);
    });

    [
      '--help --version',
      '--version --help',
      '--config --version --help',
    ].forEach((arg) => {
      test(`takes precedence over: "${arg}"`, () => {
        expect(cli(arg)).toBe(`${MAN_PAGE}\n`);
      });
    });

    [
      { cmd: 'create', arg: 'create --help' },
      { cmd: 'create', arg: '--help create something' },
      { cmd: 'create', arg: '--version --help create something' },
      { cmd: 'up', arg: 'up --help' },
      { cmd: 'up', arg: '--help up' },
      { cmd: 'up', arg: '--version --help up --num=5' },
      { cmd: 'down', arg: 'down --help' },
      { cmd: 'down', arg: '--help down' },
      { cmd: 'down', arg: '--version --help down --num=5' },
      { cmd: 'list', arg: 'list --help' },
      { cmd: 'list', arg: '--help list' },
      { cmd: 'list', arg: '--version --help list' },
      { cmd: 'clear', arg: 'clear --help' },
      { cmd: 'clear', arg: '--help clear' },
      { cmd: 'clear', arg: '--version --help clear' },
      { cmd: 'reset', arg: 'reset --help' },
      { cmd: 'reset', arg: '--help reset' },
      { cmd: 'reset', arg: '--version --help reset' },
    ].forEach(({ cmd, arg }) => {
      test(`prints out ${cmd} man page: "${arg}"`, () => {
        expect(cli(arg)).toBe(`${CMD_MAN_PAGES[cmd]}\n`);
      });
    });

    [
      '--help somecmd',
      '-x -a --help --version',
      '-y --help something --version',
    ].forEach((arg) => {
      test(`prints out man page even when given invalid options/commands: "${arg}"`, () => {
        expect(cli(arg)).toBe(`${MAN_PAGE}\n`);
      });
    });
  });

  describe('--version', () => {
    test('prints out version information', () => {
      expect(cli('--version')).toBe(`${VERSION}\n`);
    });

    [
      '--version create something',
      '--config=something/something.js --version create something',
      'create something --version',
      'up --version',
      'down --version',
    ].forEach((arg) => {
      test(`takes precedence over: "${arg}"`, () => {
        expect(cli(arg)).toBe(`${VERSION}\n`);
      });
    });

    [
      '--version somecmd',
      '-x -a --version',
      '--invalid-option --version something',
    ].forEach((arg) => {
      test(`prints out version even when given invalid options/commands: "${arg}"`, () => {
        expect(cli(arg)).toBe(`${VERSION}\n`);
      });
    });
  });

  describe('--config', () => {
    test("throw's an error because files does not exist", () => {
      expect(cli('--config=something/doesnotexist.js').stderr).toContain(
        'does not exist',
      );
    });

    test("throw's an error because the file is invalid", () => {
      expect(cli('--config=migr8.invalid.config.js').stderr).toContain(
        'somethingInvalid is not defined',
      );
    });
  });

  describe('invalid', () => {
    ['--x', '-a', '--help1', 'up -x', 'down -t'].forEach((opt) => {
      test(`"${opt}" is invalid`, () => {
        expect(cli(opt).stderr).toBeTruthy();
      });
    });
  });
});

describe('commands', () => {
  beforeEach(() => {
    deleteTestWorkspaceDir();
    createTestWorkspaceDir();
    resetTestMigrationObj();
    expect(readTestMigrationObj()).toStrictEqual(DATA_MIGRATION_OBJ_STATES[0]);
  });

  afterAll(deleteTestWorkspaceDir);

  describe('create', () => {
    test('successfully creates a migration', () => {
      const name = 'something';
      cli(`--config=migr8.workspace.config.js create ${name}`);
      const [migration] = fs.readdirSync(WORKSPACE_MIGRATIONS_DIR, {
        encoding: 'utf8',
      });
      const migrationContents = fs.readFileSync(
        path.resolve(WORKSPACE_MIGRATIONS_DIR, migration),
        { encoding: 'utf8' },
      );
      const templateContents = fs.readFileSync(
        path.resolve(__dirname, '../dist/migration_template.js'),
        { encoding: 'utf8' },
      );
      expect(migration).toContain(`${name}.js`);
      expect(migrationContents).toEqual(templateContents);
    });

    test('spaces are allowed if wrapped in double quotes', () => {
      const name = 'something else';
      cli(`--config=migr8.workspace.config.js create "${name}"`);
      const [migration] = fs.readdirSync(WORKSPACE_MIGRATIONS_DIR, {
        encoding: 'utf8',
      });
      expect(migration).toContain(`${name}.js`);
    });

    test('supports multiple arguments', () => {
      const names = ['something1', 'something2'];
      cli(`--config=migr8.workspace.config.js create ${names.join(' ')}`);
      const migrations = fs.readdirSync(WORKSPACE_MIGRATIONS_DIR, {
        encoding: 'utf8',
      });
      names.forEach((name, i) => {
        expect(migrations[i]).toContain(`${name}.js`);
      });
    });

    [
      { input: 'something?', output: 'something_.js' },
      { input: '*some/thing', output: '_some_thing.js' },
    ].forEach(({ input, output }) => {
      test(`sanitizes "${input}" to "${output}"`, () => {
        cli(`--config=migr8.workspace.config.js create ${input}`);
        const [migration] = fs.readdirSync(WORKSPACE_MIGRATIONS_DIR, {
          encoding: 'utf8',
        });
        expect(migration).toContain(output);
      });
    });

    test('requires a name for the migration', () => {
      expect(cli('create').stderr).toContain('At least 1 argument expected');
    });
  });

  describe('up', () => {
    test('successfully runs all migrations', () => {
      cli('--config=../data/migr8.config.js up', WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );
      expect(
        fs.existsSync(path.resolve(WORKSPACE_DIR, 'migr8.registry.json')),
      ).toBe(true);
    });

    [1, 2, 3].forEach((num) => {
      [
        `--config=../data/migr8.config.js up -n${num}`,
        `--config=../data/migr8.config.js up -n ${num}`,
        `--config=../data/migr8.config.js up --num=${num}`,
      ].forEach((input) => {
        test(`can specify number of migrations to run: "${input}"`, () => {
          cli(input, WORKSPACE_DIR);
          expect(readTestMigrationObj()).toStrictEqual(
            DATA_MIGRATION_OBJ_STATES[num],
          );
        });
      });
    });

    test('will execute all available migrations if n > number of migrations remaining', () => {
      cli(
        `--config=../data/migr8.config.js up -n${DATA_TOTAL_MIGRATIONS + 10}`,
        WORKSPACE_DIR,
      );
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );
    });

    test('will pick up where it left off', () => {
      cli(`--config=../data/migr8.config.js up -n2`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[2],
      );
      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[3],
      );
    });

    test('-n expects an argument', () => {
      ['-n', '--num'].forEach((opt) => {
        expect(
          cli(`--config=../data/migr8.config.js up ${opt}`, WORKSPACE_DIR)
            .stderr,
        ).toContain('requires an argument');
      });
    });
  });

  describe('down', () => {
    test('successfully rolls back all executed migrations', () => {
      cli('--config=../data/migr8.config.js up', WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );

      cli('--config=../data/migr8.config.js down', WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[0],
      );

      expect(
        fs.existsSync(path.resolve(WORKSPACE_DIR, 'migr8.registry.json')),
      ).toBe(true);
    });

    [3, 2, 1].forEach((num) => {
      [
        `--config=../data/migr8.config.js down -n${num}`,
        `--config=../data/migr8.config.js down -n ${num}`,
        `--config=../data/migr8.config.js down --num=${num}`,
      ].forEach((input) => {
        test(`can specify number of migrations to roll back: "${input}"`, () => {
          cli('--config=../data/migr8.config.js up', WORKSPACE_DIR);
          expect(readTestMigrationObj()).toStrictEqual(
            DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
          );

          cli(input, WORKSPACE_DIR);
          expect(readTestMigrationObj()).toStrictEqual(
            DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - num],
          );
        });
      });
    });

    test('will roll back all executed migrations if n > number of executed migrations', () => {
      cli(`--config=../data/migr8.config.js up`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );

      cli(
        `--config=../data/migr8.config.js down -n${DATA_TOTAL_MIGRATIONS + 10}`,
        WORKSPACE_DIR,
      );
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[0],
      );
    });

    test('will only roll back latest batch (if -n is not specified)', () => {
      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[1],
      );

      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[2],
      );

      cli(`--config=../data/migr8.config.js down`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[1],
      );

      cli(`--config=../data/migr8.config.js up -n3`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[4],
      );

      cli(
        `--config=../data/migr8.config.js down -n${DATA_TOTAL_MIGRATIONS}`,
        WORKSPACE_DIR,
      );
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[0],
      );
    });

    test('will pick up where it left off', () => {
      cli(`--config=../data/migr8.config.js up`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );

      cli(`--config=../data/migr8.config.js down -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - 1],
      );

      cli(`--config=../data/migr8.config.js down -n2`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - 3],
      );

      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - 2],
      );

      cli(`--config=../data/migr8.config.js down -n2`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS - 4],
      );
    });

    test('-n expects an argument', () => {
      ['-n', '--num'].forEach((opt) => {
        expect(
          cli(`--config=../data/migr8.config.js down ${opt}`, WORKSPACE_DIR)
            .stderr,
        ).toContain('requires an argument');
      });
    });
  });

  describe('list', () => {
    test('lists migrations', () => {
      const migrations = fs
        .readdirSync(DATA_MIGRATIONS_DIR, { encoding: 'utf8' })
        .map((migration) => {
          return `Pending  ${migration}`;
        })
        .join('\n');

      expect(cli('list')).toMatch(migrations);
    });
  });

  describe('clear', () => {
    test('rolls back all migrations (batch does not matter)', () => {
      cli(`--config=../data/migr8.config.js up -n2`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[2],
      );

      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[3],
      );

      cli(`--config=../data/migr8.config.js clear`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[0],
      );
    });
  });

  describe('reset', () => {
    test('Reruns all migrations', () => {
      cli(`--config=../data/migr8.config.js up -n2`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[2],
      );

      cli(`--config=../data/migr8.config.js up -n1`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[3],
      );

      cli(`--config=../data/migr8.config.js reset`, WORKSPACE_DIR);
      expect(readTestMigrationObj()).toStrictEqual(
        DATA_MIGRATION_OBJ_STATES[DATA_TOTAL_MIGRATIONS],
      );
    });
  });

  describe('invalid', () => {
    ['somcmd', 'other --num=5'].forEach((cmd) => {
      test(`"${cmd}" is invalid`, () => {
        expect(cli(cmd).stderr).toBeTruthy();
      });
    });
  });
});
