import { resolve } from 'path';
import { existsSync } from 'fs';
import { getopts, OptSchema } from '@prasadrajandran/getopts';
import { Migr8 } from './migr8';
import * as logger from './cli/helpers/logger';
import { Migr8Config } from './interfaces/migr8_config';
import { findMaxStrLength } from './cli/helpers/find_max_str_length';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import man from './man.txt';

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
    {
      longName: '--template',
      arg: 'required',
      argFilter: (arg) => {
        const filename = resolve(arg);
        if (existsSync(filename)) {
          return filename;
        } else {
          throw new Error(`${filename} does not exist`);
        }
      },
    },
    {
      longName: '--migrations-dir',
      arg: 'required',
      argFilter: (arg) => {
        const dir = resolve(arg);
        if (existsSync(dir)) {
          return dir;
        } else {
          throw new Error(`${dir} does not exist`);
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

(async () => {
  if (opts.has('--help')) {
    logger.inform(man);
    return;
  } else if (opts.has('--version')) {
    logger.inform(`${packageName}: ${packageVersion}`);
    return;
  } else if (errors.length) {
    for (const { name, message } of errors) {
      logger.scream(`[${name}] ${message}`);
    }
    return;
  }

  const config = ((): Migr8Config | undefined => {
    if (opts.has('--config')) {
      return opts.get('--config') as Migr8Config;
    } else if (existsSync(DEFAULT_CONFIG_FILENAME)) {
      return require(DEFAULT_CONFIG_FILENAME);
    }
  })();
  const migr8 = new (config?.Migr8 || Migr8)({
    migrationsDir:
      (opts.get('--migrations-dir') as string) || config?.migrationsDir,

    templateFilename:
      (opts.get('--template') as string) || config?.templateFilename,

    registry: config?.registry,
    upArg: config?.upArg,
    downArg: config?.downArg,
  });

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
        logger.scream(err);
      } else if (!migrations.length) {
        logger.inform('Nothing to migrate.');
      }

      return err || true;
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
        logger.scream(err);
      } else if (!migrations.length) {
        logger.inform('Nothing to rollback.');
      }

      return err || true;
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
      const clearCmdValue = await cli.clear();
      if (clearCmdValue !== true) {
        return clearCmdValue;
      }

      const upCmdValue = await cli.up();
      if (upCmdValue !== true) {
        return upCmdValue;
      }

      return true;
    },
  };

  const cmd = cmds[0] as 'create' | 'up' | 'down' | 'list' | 'clear' | 'reset';

  await cli[cmd]();
})();
