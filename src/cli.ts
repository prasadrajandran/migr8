import { resolve } from 'path';
import { existsSync } from 'fs';
import { getopts } from '@prasadrajandran/getopts';
import { OptSchema } from '@prasadrajandran/getopts/dist/interfaces/schema';
import { Migr8 } from './migr8';
import * as logger from './cli/helpers/logger';
import { Migr8Config } from './interfaces/migr8_config';
import { findMaxStrLength } from './cli/helpers/find_max_str_length';
import man from './man_pages/man.txt';
import createMan from './man_pages/create_man.txt';
import upMan from './man_pages/up_man.txt';
import downMan from './man_pages/down_man.txt';
import listMan from './man_pages/list_man.txt';
import clearMan from './man_pages/clear_man.txt';
import resetMan from './man_pages/reset_man.txt';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

const DEFAULT_CONFIG_FILENAME = resolve(__dirname, './migr8.config.js');

const CMDS = {
  CREATE: 'create',
  UP: 'up',
  DOWN: 'down',
  LIST: 'list',
  CLEAR: 'clear',
  RESET: 'reset',
} as const;

type CMD = typeof CMDS[keyof typeof CMDS];

const CMD_MANS = {
  create: createMan,
  up: upMan,
  down: downMan,
  list: listMan,
  clear: clearMan,
  reset: resetMan,
} as const;

const numOpt: OptSchema = {
  name: ['-n', '--num'],
  arg: {
    required: true,
    filter: (arg: string) => {
      const n = Number(arg);
      if (!Number.isFinite(n)) {
        throw new Error(`${arg} is not a valid number`);
      }
      return n;
    },
  },
};

const { opts, cmds, args } = getopts(
  {
    opts: [
      { name: '--help' },
      { name: '--version' },
      {
        name: '--config',
        arg: {
          required: true,
          filter: (arg) => {
            const filename = resolve(arg);
            if (existsSync(filename)) {
              return require(/* webpackIgnore: true */ filename);
            } else {
              throw new Error(`${filename} does not exist`);
            }
          },
        },
      },
    ],
    cmds: [
      { name: CMDS.CREATE, args: { min: 1 } },
      { name: CMDS.UP, opts: [numOpt], args: { max: 0 } },
      { name: CMDS.DOWN, opts: [numOpt], args: { max: 0 } },
      { name: CMDS.LIST, args: { max: 0 } },
      { name: CMDS.CLEAR, args: { max: 0 } },
      { name: CMDS.RESET, args: { max: 0 } },
    ],
  },
  {
    hooks: {
      helpOpt: {
        callback: ({ cmds }) => {
          const cmd = cmds[0] as CMD | undefined;
          logger.inform(cmd ? CMD_MANS[cmd] : man);
        },
      },
      versionOpt: {
        callback: () => {
          logger.inform(`${packageName}: ${packageVersion}`);
        },
      },
      parserErrors: {
        callback: ({ errors }) => {
          for (const { message } of errors) {
            logger.scream(`${packageName}: ${message}`);
          }
        },
      },
    },
  },
);

(async () => {
  const config = ((): Migr8Config | undefined => {
    if (opts.has('--config')) {
      return opts.get('--config') as Migr8Config;
    } else if (existsSync(DEFAULT_CONFIG_FILENAME)) {
      return require(/* webpackIgnore: true */ DEFAULT_CONFIG_FILENAME);
    }
  })();
  const migr8 = new (config?.Migr8 || Migr8)(config || {});

  const cli = {
    create: async () => {
      for (const migrationName of args as string[]) {
        logger.inform(`Created: ${await migr8.create(migrationName)}`);
      }
      return true;
    },
    up: async () => {
      const num = opts.get(numOpt.name) as number;
      const { migrations, err } = await migr8.up({ num });
      const batchPadding = findMaxStrLength(
        migrations.map(({ batch }) => batch),
      );

      for (const { name, batch } of migrations) {
        const status = `Migrated  Batch ${String(batch).padStart(
          batchPadding,
          '0',
        )}`;
        logger.inform(`${status}  ${name}`);
      }

      if (err) {
        return err;
      } else if (!migrations.length) {
        logger.inform('Nothing to migrate.');
      }

      return true;
    },
    down: async (n?: number) => {
      const num = n || (opts.get(numOpt.name) as number);
      const { migrations, err } = await migr8.down({ num });
      const batchPadding = findMaxStrLength(
        migrations.map(({ batch }) => batch),
      );

      for (const { name, batch } of migrations) {
        const status = `Rolled back  Batch ${String(batch).padStart(
          batchPadding,
          '0',
        )}`;
        logger.inform(`${status}  ${name}`);
      }
      if (err) {
        return err;
      } else if (!migrations.length) {
        logger.inform('Nothing to roll back.');
      }

      return true;
    },
    list: async () => {
      const executedMigrations = await migr8.registry.getExecutedMigrations();
      const batchPadding = findMaxStrLength(
        executedMigrations.map(({ batch }) => batch),
      );

      const hasExecutedMigrations = Boolean(executedMigrations.length);
      for (const migration of await migr8.getMigrations()) {
        const executed = executedMigrations.find(
          ({ name }) => migration === name,
        );

        const executedStatus = `Migrated  Batch ${String(
          executed ? executed.batch : '',
        ).padStart(batchPadding, '0')}`;

        let status = '';
        if (executed) {
          status = executedStatus;
        } else if (hasExecutedMigrations) {
          status = 'Pending'.padEnd(executedStatus.length, ' ');
        } else {
          status = 'Pending';
        }

        logger.inform(`${status}  ${migration}`);
      }

      return true;
    },
    clear: async () => {
      const num = (await migr8.registry.getExecutedMigrations()).length;
      return await cli.down(num);
    },
    reset: async (): Promise<true | Error> => {
      const clearCmdResult = await cli.clear();
      if (clearCmdResult !== true) {
        return clearCmdResult;
      }
      return await cli.up();
    },
  };

  const cmd = cmds[0] as CMD;

  try {
    const result = await cli[cmd]();
    if (result !== true) {
      logger.scream(`${packageName}: ${result}`);
      process.exit(1);
    }
  } catch (err) {
    // This prints errors that are unexpected (i.e. errors that are thrown by
    // the command, not errors that are returned).
    logger.scream(`${packageName}: ${err}`);
    process.exit(1);
  }
})();
