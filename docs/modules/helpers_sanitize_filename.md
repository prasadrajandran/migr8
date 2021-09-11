[migr8 - v1.0.0](../README.md) / helpers/sanitize_filename

# Module: helpers/sanitize_filename

## Table of contents

### Variables

- [RESERVED_CHARACTERS](helpers_sanitize_filename.md#reserved_characters)
- [RESERVED_WINDOWS_FILENAMES](helpers_sanitize_filename.md#reserved_windows_filenames)

### Functions

- [sanitizeFilename](helpers_sanitize_filename.md#sanitizefilename)

## Variables

### RESERVED_CHARACTERS

• `Const` **RESERVED_CHARACTERS**: `string`[]

#### Defined in

[helpers/sanitize_filename.ts:1](https://github.com/prasadrajandran/migr8/blob/5654936/src/helpers/sanitize_filename.ts#L1)

---

### RESERVED_WINDOWS_FILENAMES

• `Const` **RESERVED_WINDOWS_FILENAMES**: `string`[]

#### Defined in

[helpers/sanitize_filename.ts:12](https://github.com/prasadrajandran/migr8/blob/5654936/src/helpers/sanitize_filename.ts#L12)

## Functions

### sanitizeFilename

▸ `Const` **sanitizeFilename**(`filename`, `replacement?`): `string`

Removes any reserved characters (Unix and Windows) from a filename.

#### Parameters

| Name          | Type     | Default value | Description                                     |
| :------------ | :------- | :------------ | :---------------------------------------------- |
| `filename`    | `string` | `undefined`   | Filename (without path) to sanitize.            |
| `replacement` | `string` | `'_'`         | Reserved characters will be replaced with this. |

#### Returns

`string`

Sanitized filename

#### Defined in

[helpers/sanitize_filename.ts:58](https://github.com/prasadrajandran/migr8/blob/5654936/src/helpers/sanitize_filename.ts#L58)
