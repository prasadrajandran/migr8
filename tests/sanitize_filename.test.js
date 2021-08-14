const {
  RESERVED_CHARACTERS,
  RESERVED_WINDOWS_FILENAMES,
  sanitizeFilename,
} = require('../dist/helpers/sanitize_filename');

const REPLACEMENT = '_';

const INVALID_ITEMS = RESERVED_CHARACTERS.concat(RESERVED_WINDOWS_FILENAMES)
  .concat(RESERVED_WINDOWS_FILENAMES.map((name) => name.toLowerCase()))
  .concat(RESERVED_WINDOWS_FILENAMES.map((name) => `${name}.txt`))
  .concat('.');

describe('sanitizeFilename()', () => {
  test(`replaces an empty string with the replacement`, () => {
    expect(sanitizeFilename('', REPLACEMENT)).toBe(REPLACEMENT);
  });

  INVALID_ITEMS.forEach((item) => {
    test(`successfully sanitizes "${item}" to "${REPLACEMENT}"`, () => {
      expect(sanitizeFilename(item, REPLACEMENT)).toBe(REPLACEMENT);
    });
  });

  INVALID_ITEMS.forEach((item) => {
    test(`not allowed to use "${item}" as a replacement`, () => {
      expect(() => sanitizeFilename('_', item)).toThrow();
    });
  });
});
