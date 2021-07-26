[migr8 - v1.0.0-alpha.1](../README.md) / [interfaces/downed_migrations](../modules/interfaces_downed_migrations.md) / DownedMigrations

# Interface: DownedMigrations

[interfaces/downed_migrations](../modules/interfaces_downed_migrations.md).DownedMigrations

## Table of contents

### Properties

- [err](interfaces_downed_migrations.DownedMigrations.md#err)
- [migrations](interfaces_downed_migrations.DownedMigrations.md#migrations)

## Properties

### err

• **err**: `null` \| `Error`

Reference to the Error if an error occured.

#### Defined in

[interfaces/downed_migrations.ts:12](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/interfaces/downed_migrations.ts#L12)

---

### migrations

• **migrations**: [`ExecutedMigration`](interfaces_executed_migration.ExecutedMigration.md)[]

Migrations that were rolledback.

#### Defined in

[interfaces/downed_migrations.ts:7](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/interfaces/downed_migrations.ts#L7)
