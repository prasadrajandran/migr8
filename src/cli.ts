import { resolve } from 'path';
import { existsSync } from 'fs';
import { getopts, OptSchema } from '@prasadrajandran/getopts';
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

const DEFAULT_CONFIG_FILENAME = resolve(__dirname, './.migr8.config.js');

const nOpt: OptSchema = {
  name: '-n',
  longName: '--num',
  arg: 'required',
  argFilter: (arg: string) => {
    const n = Number(arg);
    if (!Number.isFinite(n)) {
      throw new Error(`${arg} is not a valid number`);
    }
    return n;
  },
};

const { opts, cmds, args, errors } = getopts({
  opts: [
    { longName: '--help' },
    { longName: '--version' },
    {
      longName: '--config',
      arg: 'required',
      argFilter: (arg) => {
        const filename = resolve(arg);
        if (existsSync(filename)) {
          return require(filename);
        } else {
          throw new Error(`${filename} does not exist`);
        }
      },
    },
  ],
  cmds: [
    { name: 'create', minArgs: 1 },
    { name: 'up', opts: [nOpt] },
    { name: 'down', opts: [nOpt] },
    { name: 'list' },
    { name: 'clear' },
    { name: 'reset' },
  ],
});

if (opts.has('--help')) {
  switch (cmds[0]) {
    case 'create':
      logger.inform(createMan);
      break;
    case 'up':
      logger.inform(upMan);
      break;
    case 'down':
      logger.inform(downMan);
      break;
    case 'list':
      logger.inform(listMan);
      break;
    case 'clear':
      logger.inform(clearMan);
      break;
    case 'reset':
      logger.inform(resetMan);
      break;
    default:
      logger.inform(man);
  }
  process.exit(0);
} else if (opts.has('--version')) {
  logger.inform(`${packageName}: ${packageVersion}`);
  process.exit(0);
} else if (errors.length) {
  for (const { name, message } of errors) {
    logger.scream(`${packageName}: (${name}) ${message}`);
  }
  process.exit(1);
}

(async () => {
  const config = ((): Migr8Config | undefined => {
    if (opts.has('--config')) {
      return opts.get('--config') as Migr8Config;
    } else if (existsSync(DEFAULT_CONFIG_FILENAME)) {
      return require(DEFAULT_CONFIG_FILENAME);
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
      const num = (opts.get(nOpt.name as string) ||
        opts.get(nOpt.longName as string)) as number;
      const { migrations, err } = await migr8.up({ num });
      const padding = findMaxStrLength(migrations.map(({ batch }) => batch));

      for (const { name, batch } of migrations) {
        const status = `Migrated  Batch ${String(batch).padStart(
          padding,
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
      const num = (n ||
        opts.get(nOpt.name as string) ||
        opts.get(nOpt.longName as string)) as number;
      const { migrations, err } = await migr8.down({ num });
      const padding = findMaxStrLength(migrations.map(({ batch }) => batch));

      for (const { name, batch } of migrations) {
        const status = `Rollbacked  Batch ${String(batch).padStart(
          padding,
          '0',
        )}`;
        logger.inform(`${status}  ${name}`);
      }
      if (err) {
        return err;
      } else if (!migrations.length) {
        logger.inform('Nothing to rollback.');
      }

      return true;
    },
    list: async () => {
      const executedMigrations = await migr8.registry.getExecutedMigrations();
      const padding = findMaxStrLength(
        executedMigrations.map(({ batch }) => batch),
      );

      for (const migration of await migr8.getMigrations()) {
        const executed = executedMigrations.find(
          ({ name }) => migration === name,
        );

        let status = '';
        if (executed) {
          String(executed.batch).padStart(padding, '0');
          status = `Migrated  Batch ${String(executed.batch).padStart(
            padding,
            '0',
          )}`;
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

  const cmd = cmds[0] as 'create' | 'up' | 'down' | 'list' | 'clear' | 'reset';

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
