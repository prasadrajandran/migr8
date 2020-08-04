/**
 * Terminal colours.
 *
 * @see https://stackoverflow.com/a/41407246
 */
const RED_TEXT = '\x1b[31m';
const YELLOW_TEXT = '\x1b[33m';
const CYAN_TEXT = '\x1b[36m';
const RESET_CONSOLE = '\x1b[0m';

const log = (msg, type, color = '', highlight = '') => {
  console[type](`${color}${highlight}%s${RESET_CONSOLE}`, msg);
};

const inform = (msg) => log(msg, 'info', CYAN_TEXT);

const warn = (msg) => log(msg, 'warn', YELLOW_TEXT);

const scream = (msg) => log(msg, 'error', RED_TEXT);

module.exports.inform = inform;
module.exports.warn = warn;
module.exports.scream = scream;
