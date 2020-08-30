/**
 * Terminal colours.
 *
 * @see https://stackoverflow.com/a/41407246
 */
const RED_TEXT = '\x1b[31m';
const YELLOW_TEXT = '\x1b[33m';
const CYAN_TEXT = '\x1b[36m';
const RESET_CONSOLE = '\x1b[0m';

export const log = (
  msg: any,
  type: 'info' | 'warn' | 'error',
  color = '',
  highlight = '',
) => {
  console[type](`${color}${highlight}%s${RESET_CONSOLE}`, msg);
};

export const inform = (msg: any) => log(msg, 'info', CYAN_TEXT);

export const warn = (msg: any) => log(msg, 'warn', YELLOW_TEXT);

export const scream = (msg: any) => log(msg, 'error', RED_TEXT);
