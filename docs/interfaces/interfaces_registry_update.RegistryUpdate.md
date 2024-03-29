[migr8 - v1.0.1](../README.md) / [interfaces/registry_update](../modules/interfaces_registry_update.md) / RegistryUpdate

# Interface: RegistryUpdate

[interfaces/registry_update](../modules/interfaces_registry_update.md).RegistryUpdate

## Table of contents

### Properties

- [direction](interfaces_registry_update.RegistryUpdate.md#direction)
- [migration](interfaces_registry_update.RegistryUpdate.md#migration)
- [migrations](interfaces_registry_update.RegistryUpdate.md#migrations)

## Properties

### direction

• **direction**: `"up"` \| `"down"`

Operation that was performed.

#### Defined in

[interfaces/registry_update.ts:7](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/interfaces/registry_update.ts#L7)

---

### migration

• **migration**: [`ExecutedMigration`](interfaces_executed_migration.ExecutedMigration.md)

Migration that was either executed or rolled back.

#### Defined in

[interfaces/registry_update.ts:17](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/interfaces/registry_update.ts#L17)

---

### migrations

• **migrations**: [`ExecutedMigration`](interfaces_executed_migration.ExecutedMigration.md)[]

All executed migrations.

#### Defined in

[interfaces/registry_update.ts:12](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/interfaces/registry_update.ts#L12)
