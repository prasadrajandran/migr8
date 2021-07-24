[migr8 - v1.0.0-alpha.1](../README.md) / [migr8](../modules/migr8.md) / Migr8

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

• **new Migr8**(`__namedParameters`)

Create a new Migr8 instance.

#### Parameters

| Name                | Type                                                                                 |
| :------------------ | :----------------------------------------------------------------------------------- |
| `__namedParameters` | [`Migr8Constructor`](../interfaces/interfaces_migr8_constructor.Migr8Constructor.md) |

#### Defined in

[migr8.ts:72](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L72)

## Properties

### downArg

• **downArg**: [`DownArg`](../interfaces/interfaces_down_arg.DownArg.md)

Callback that is executed to produce an argument that will be passed to
migrations when they are being rollbacked.

#### Defined in

[migr8.ts:65](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L65)

---

### migrationFileEncoding

• **migrationFileEncoding**: `"utf8"`

File encoding for the migration files.

#### Defined in

[migr8.ts:33](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L33)

---

### migrationsDir

• **migrationsDir**: `string`

Absolute path to the folder housing the migrations.

#### Defined in

[migr8.ts:39](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L39)

---

### registry

• **registry**: [`Registry`](../interfaces/interfaces_registry.Registry.md)

Registry driver that allows us to query the registry for executed
migrations.

#### Defined in

[migr8.ts:51](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L51)

---

### templateFilename

• **templateFilename**: `string`

Absolute path to the template for new migrations.

#### Defined in

[migr8.ts:45](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L45)

---

### upArg

• **upArg**: [`UpArg`](../interfaces/interfaces_up_arg.UpArg.md)

Callback that is executed to produce an argument that will be passed to
migrations when they are being migrated.

#### Defined in

[migr8.ts:58](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L58)

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

[migr8.ts:95](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L95)

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

[migr8.ts:221](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L221)

---

### down

▸ **down**(`__namedParameters?`): `Promise`<[`DownedMigrations`](../interfaces/interfaces_downed_migrations.DownedMigrations.md)\>

Rollback latest batch of executed migrations.

#### Parameters

| Name                | Type          |
| :------------------ | :------------ |
| `__namedParameters` | `DownOptions` |

#### Returns

`Promise`<[`DownedMigrations`](../interfaces/interfaces_downed_migrations.DownedMigrations.md)\>

Results of the rollback.

#### Defined in

[migr8.ts:167](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L167)

---

### getMigrations

▸ **getMigrations**(): `Promise`<`string`[]\>

Get all the migrations.

#### Returns

`Promise`<`string`[]\>

Migration filenames (not including the path).

#### Defined in

[migr8.ts:244](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L244)

---

### getPendingMigrations

▸ **getPendingMigrations**(): `Promise`<`string`[]\>

Get migrations that have not been migrated.

#### Returns

`Promise`<`string`[]\>

Pending migration filenames (not including the path).

#### Defined in

[migr8.ts:258](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L258)

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

[migr8.ts:116](https://github.com/prasadrajandran/migr8/blob/33defe4/src/migr8.ts#L116)
