[migr8 - v1.0.0-beta.1](../README.md) / [interfaces/migr8_constructor](../modules/interfaces_migr8_constructor.md) / Migr8Constructor

# Interface: Migr8Constructor

[interfaces/migr8_constructor](../modules/interfaces_migr8_constructor.md).Migr8Constructor

## Table of contents

### Properties

- [downArg](interfaces_migr8_constructor.Migr8Constructor.md#downarg)
- [migrationsDir](interfaces_migr8_constructor.Migr8Constructor.md#migrationsdir)
- [registry](interfaces_migr8_constructor.Migr8Constructor.md#registry)
- [templateFilename](interfaces_migr8_constructor.Migr8Constructor.md#templatefilename)
- [upArg](interfaces_migr8_constructor.Migr8Constructor.md#uparg)

## Properties

### downArg

• `Optional` **downArg**: [`DownArg`](interfaces_down_arg.DownArg.md)

Callback that produces an argument for migrations when they are being
rolled back.

#### Defined in

[interfaces/migr8_constructor.ts:32](https://github.com/prasadrajandran/migr8/blob/560fe49/src/interfaces/migr8_constructor.ts#L32)

---

### migrationsDir

• `Optional` **migrationsDir**: `string`

Directory that contains the migration files.

#### Defined in

[interfaces/migr8_constructor.ts:9](https://github.com/prasadrajandran/migr8/blob/560fe49/src/interfaces/migr8_constructor.ts#L9)

---

### registry

• `Optional` **registry**: [`Registry`](interfaces_registry.Registry.md)

Registry driver that allows us to query the registry for executed
migrations.

#### Defined in

[interfaces/migr8_constructor.ts:20](https://github.com/prasadrajandran/migr8/blob/560fe49/src/interfaces/migr8_constructor.ts#L20)

---

### templateFilename

• `Optional` **templateFilename**: `string`

Filename of the template that will be used for new migrations.

#### Defined in

[interfaces/migr8_constructor.ts:14](https://github.com/prasadrajandran/migr8/blob/560fe49/src/interfaces/migr8_constructor.ts#L14)

---

### upArg

• `Optional` **upArg**: [`UpArg`](interfaces_up_arg.UpArg.md)

Callback that produces an argument for migrations when they are being
migrated.

#### Defined in

[interfaces/migr8_constructor.ts:26](https://github.com/prasadrajandran/migr8/blob/560fe49/src/interfaces/migr8_constructor.ts#L26)
