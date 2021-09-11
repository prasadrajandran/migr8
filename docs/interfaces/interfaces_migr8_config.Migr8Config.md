[migr8 - v1.0.0](../README.md) / [interfaces/migr8_config](../modules/interfaces_migr8_config.md) / Migr8Config

# Interface: Migr8Config

[interfaces/migr8_config](../modules/interfaces_migr8_config.md).Migr8Config

## Table of contents

### Properties

- [Migr8](interfaces_migr8_config.Migr8Config.md#migr8)
- [downArg](interfaces_migr8_config.Migr8Config.md#downarg)
- [migrationsDir](interfaces_migr8_config.Migr8Config.md#migrationsdir)
- [registry](interfaces_migr8_config.Migr8Config.md#registry)
- [templateFilename](interfaces_migr8_config.Migr8Config.md#templatefilename)
- [upArg](interfaces_migr8_config.Migr8Config.md#uparg)

## Properties

### Migr8

• `Optional` **Migr8**: typeof [`Migr8`](../classes/migr8.Migr8.md)

Migr8 instance to use. A modified version could be used as long as it
inherits from Migr8 and its API is unchanged. Will default to Migr8.

#### Defined in

[interfaces/migr8_config.ts:9](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L9)

---

### downArg

• `Optional` **downArg**: [`DownArg`](interfaces_down_arg.DownArg.md)

Function whose resolved value will be passed to migrations that are being
rolled back. Will default to a function that resolves to undefined.

#### Defined in

[interfaces/migr8_config.ts:38](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L38)

---

### migrationsDir

• `Optional` **migrationsDir**: `string`

Migrations directory. Will default to "migrations" in the current working
directory.

#### Defined in

[interfaces/migr8_config.ts:15](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L15)

---

### registry

• `Optional` **registry**: [`Registry`](interfaces_registry.Registry.md)

Registry driver. Will default to the File System Registry driver if not
specified.

#### Defined in

[interfaces/migr8_config.ts:26](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L26)

---

### templateFilename

• `Optional` **templateFilename**: `string`

Template for the migration files. A default will be used if not specified.

#### Defined in

[interfaces/migr8_config.ts:20](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L20)

---

### upArg

• `Optional` **upArg**: [`UpArg`](interfaces_up_arg.UpArg.md)

Function whose resolved value will be passed to migrations that are being
executed. Will default to a function that resolves to undefined.

#### Defined in

[interfaces/migr8_config.ts:32](https://github.com/prasadrajandran/migr8/blob/5654936/src/interfaces/migr8_config.ts#L32)
