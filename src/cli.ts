#!/usr/bin/env node

import * as path from 'path';
import { Migr8 } from './migr8.js';
import { Migr8Config } from './interfaces/migr8_config';
import { FileSystemRegistry } from './registry_drivers/file_system_registry';
import * as logger from './cli/helpers/logger';
import { parseCommands } from './cli/helpers/parse_commands';
import { parseOption } from './cli/helpers/parse_option';
import { create as createCmd } from './cli/commands/create';
import { up as upCmd } from './cli/commands/up';
import { down as downCmd } from './cli/commands/down';
import { list as listCmd } from './cli/commands/list';
import { clear as clearCmd } from './cli/commands/clear';
import { reset as resetCmd } from './cli/commands/reset';
import { Migr8Constructor } from './interfaces/migr8_constructor.js';

const DEFAULT_CONFIG_FILENAME = './.migr8.config.js';
const DEFAULT_FILE_SYSTEM_REGISTRY_FILENAME = './.migr8.registry.json';
const DEFAULT_TEMPLATE_FILENAME = path.resolve(
  __dirname,
  'migration_template.js',
);
const [, , ...args] = process.argv;

interface CliOptions {
  config: Migr8Config;
  num: number;
}

const opts: CliOptions = {
  config: require(path.resolve(
    parseOption(args, 'config', 'c', DEFAULT_CONFIG_FILENAME),
  )),
  num: Number(parseOption(args, 'num', 'n', 0)),
};

if (!opts.config.migrationsDir) {
  opts.config.migrationsDir = 'migrations';
}

if (!opts.config.templateFilename) {
  opts.config.templateFilename = DEFAULT_TEMPLATE_FILENAME;
}

if (!opts.config.registry) {
  opts.config.registry = new FileSystemRegistry(
    DEFAULT_FILE_SYSTEM_REGISTRY_FILENAME,
  );
}

if (!opts.config.Migr8) {
  opts.config.Migr8 = Migr8;
}

const migr8 = new Migr8(opts.config as Migr8Constructor);

const cmd = parseCommands(
  args,
  'create',
  'up',
  'down',
  'list',
  'clear',
  'reset',
);

(async () => {
  switch (cmd.name) {
    case 'create':
      await createCmd(migr8, cmd.value);
      break;
    case 'up':
      await upCmd(migr8, opts.num);
      break;
    case 'down':
      await downCmd(migr8, opts.num);
      break;
    case 'list':
      await listCmd(migr8);
      break;
    case 'clear':
      await clearCmd(migr8);
      break;
    case 'reset':
      await resetCmd(migr8);
      break;
    default:
      logger.warn('Invalid command.');
  }
})();
