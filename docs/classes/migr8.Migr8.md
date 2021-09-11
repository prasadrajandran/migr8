[migr8 - v1.0.0](../README.md) / [migr8](../modules/migr8.md) / Migr8

# Class: Migr8

[migr8](../modules/migr8.md).Migr8

## Table of contents

### Constructors

- [constructor](migr8.Migr8.md#constructor)

### Properties

- [downArg](migr8.Migr8.md#downarg)
- [migrationFileEncoding](migr8.Migr8.md#migrationfileencoding)
- [migrationsDir](migr8.Migr8.md#migrationsdir)
- [registry](migr8.Migr8.md#registry)
- [templateFilename](migr8.Migr8.md#templatefilename)
- [upArg](migr8.Migr8.md#uparg)

### Methods

- [create](migr8.Migr8.md#create)
- [createFilename](migr8.Migr8.md#createfilename)
- [down](migr8.Migr8.md#down)
- [getMigrations](migr8.Migr8.md#getmigrations)
- [getPendingMigrations](migr8.Migr8.md#getpendingmigrations)
- [up](migr8.Migr8.md#up)

## Constructors

### constructor

• **new Migr8**(`__namedParameters?`)

Create a new Migr8 instance.

#### Parameters

| Name                | Type                                                                                 |
| :------------------ | :----------------------------------------------------------------------------------- |
| `__namedParameters` | [`Migr8Constructor`](../interfaces/interfaces_migr8_constructor.Migr8Constructor.md) |

#### Defined in

[migr8.ts:79](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L79)

## Properties

### downArg

• **downArg**: [`DownArg`](../interfaces/interfaces_down_arg.DownArg.md)

Callback that is executed to produce an argument that will be passed to
migrations when they are being rolledback.

#### Defined in

[migr8.ts:72](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L72)

---

### migrationFileEncoding

• **migrationFileEncoding**: `"utf8"`

File encoding for the migration files.

#### Defined in

[migr8.ts:40](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L40)

---

### migrationsDir

• **migrationsDir**: `string`

Absolute path to the folder housing the migrations.

#### Defined in

[migr8.ts:46](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L46)

---

### registry

• **registry**: [`Registry`](../interfaces/interfaces_registry.Registry.md)

Registry driver that allows us to query the registry for executed
migrations.

#### Defined in

[migr8.ts:58](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L58)

---

### templateFilename

• **templateFilename**: `string`

Absolute path to the template for new migrations.

#### Defined in

[migr8.ts:52](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L52)

---

### upArg

• **upArg**: [`UpArg`](../interfaces/interfaces_up_arg.UpArg.md)

Callback that is executed to produce an argument that will be passed to
migrations when they are being migrated.

#### Defined in

[migr8.ts:65](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L65)

## Methods

### create

▸ **create**(`migrationName`): `Promise`<`string`\>

Create a new migration file.

#### Parameters

| Name            | Type     | Description                                     |
| :-------------- | :------- | :---------------------------------------------- |
| `migrationName` | `string` | Name (not including the path) of the migration. |

#### Returns

`Promise`<`string`\>

Promise that resolves to the filename of the migration that was
created.

#### Defined in

[migr8.ts:102](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L102)

---

### createFilename

▸ **createFilename**(`migrationName`): `Promise`<`string`\>

Generates a filename (including the path) for a new migration.

Timezonze: UTC 00:00.

#### Parameters

| Name            | Type     | Description                               |
| :-------------- | :------- | :---------------------------------------- |
| `migrationName` | `string` | Name of the migration (without the path). |

#### Returns

`Promise`<`string`\>

A promise that resolves to the generated filename.

#### Defined in

[migr8.ts:233](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L233)

---

### down

▸ **down**(`__namedParameters?`): `Promise`<[`DownedMigrations`](../interfaces/interfaces_downed_migrations.DownedMigrations.md)\>

Roll back latest batch of executed migrations.

#### Parameters

| Name                | Type          |
| :------------------ | :------------ |
| `__namedParameters` | `DownOptions` |

#### Returns

`Promise`<[`DownedMigrations`](../interfaces/interfaces_downed_migrations.DownedMigrations.md)\>

Results of the rollback.

#### Defined in

[migr8.ts:179](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L179)

---

### getMigrations

▸ **getMigrations**(): `Promise`<`string`[]\>

Get all the migrations.

#### Returns

`Promise`<`string`[]\>

Migration filenames (not including the path).

#### Defined in

[migr8.ts:256](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L256)

---

### getPendingMigrations

▸ **getPendingMigrations**(): `Promise`<`string`[]\>

Get migrations that have not been migrated.

#### Returns

`Promise`<`string`[]\>

Pending migration filenames (not including the path).

#### Defined in

[migr8.ts:270](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L270)

---

### up

▸ **up**(`__namedParameters?`): `Promise`<[`UppedMigrations`](../interfaces/interfaces_upped_migrations.UppedMigrations.md)\>

Run pending migrations.

#### Parameters

| Name                | Type        |
| :------------------ | :---------- |
| `__namedParameters` | `UpOptions` |

#### Returns

`Promise`<[`UppedMigrations`](../interfaces/interfaces_upped_migrations.UppedMigrations.md)\>

Results of the migration.

#### Defined in

[migr8.ts:128](https://github.com/prasadrajandran/migr8/blob/5654936/src/migr8.ts#L128)
