export const RESERVED_CHARACTERS = [
  '/', // Unix and Windows
  '<', // Windows
  ':', // Windows
  '"', // Windows
  '\\', // Windows
  '|', // Windows
  '?', // Windows
  '*', // Windows
];

export const RESERVED_WINDOWS_FILENAMES = [
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
];

const RESERVED_CHARACTERS_REGEX = new RegExp(
  `[${RESERVED_CHARACTERS.join('\\')}]`,
  'g',
);

const RESERVED_WINDOWS_FILENAMES_REGEX = new RegExp(
  RESERVED_WINDOWS_FILENAMES
    // Invalid if it also ends with an extension. E.g. "CON.txt"
    .map((name) => `^${name}(\\..+)?$`)
    .join('|'),
  'i',
);

const TRAILING_PERIOD_REGEX = /\.$/;

/**
 * Removes any reserved characters (Unix and Windows) from a filename.
 * @param filename - Filename (without path) to sanitize.
 * @param replacement - Reserved characters will be replaced with this.
 * @returns Sanitized filename
 */
export const sanitizeFilename = (
  filename: string,
  replacement = '_',
): string => {
  if (
    !replacement.trim() ||
    replacement.match(RESERVED_CHARACTERS_REGEX) ||
    replacement.match(RESERVED_WINDOWS_FILENAMES_REGEX) ||
    replacement.match(TRAILING_PERIOD_REGEX)
  ) {
    throw new Error(`Invalid replacement string: "${replacement}"`);
  }

  const trimmed = filename.trim();
  if (!trimmed) {
    return replacement;
  }
  return trimmed
    .replace(RESERVED_CHARACTERS_REGEX, replacement)
    .replace(RESERVED_WINDOWS_FILENAMES_REGEX, replacement)
    .replace(TRAILING_PERIOD_REGEX, replacement);
};
