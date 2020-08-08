#!/usr/bin/env node

const path = require('path');
const Migr8 = require('./migr8.js');
const logger = require('./cli/helpers/logger');
const parseCommands = require('./cli/helpers/parse_commands');
const parseOption = require('./cli/helpers/parse_option');
const createCmd = require('./cli/commands/create');
const upCmd = require('./cli/commands/up');
const downCmd = require('./cli/commands/down');
const listCmd = require('./cli/commands/list');
const clearCmd = require('./cli/commands/clear');
const resetCmd = require('./cli/commands/reset');

const DEFAULT_CONF_FILENAME = './.migr8.conf.js';

const [, , ...args] = process.argv;

const opts = {};

opts.conf = require(path.resolve(
  parseOption(args, 'config', 'c', DEFAULT_CONF_FILENAME),
));
opts.conf.templateFilename = parseOption(
  args,
  'template',
  't',
  opts.conf.templateFilename,
);
opts.conf.registryFilename = parseOption(
  args,
  'registry',
  'reg',
  opts.conf.registryFilename,
);
opts.num = Number(parseOption(args, 'num', 'n', 0));

const migr8 = new Migr8(opts.conf);

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
