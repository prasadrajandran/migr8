[migr8 - v1.0.1](../README.md) / [interfaces/registry](../modules/interfaces_registry.md) / Registry

# Interface: Registry

[interfaces/registry](../modules/interfaces_registry.md).Registry

## Implemented by

- [`FileSystemRegistry`](../classes/registry_drivers_file_system_registry.FileSystemRegistry.md)

## Table of contents

### Methods

- [getExecutedMigrations](interfaces_registry.Registry.md#getexecutedmigrations)
- [setExecutedMigrations](interfaces_registry.Registry.md#setexecutedmigrations)

## Methods

### getExecutedMigrations

▸ **getExecutedMigrations**(): `Promise`<[`ExecutedMigration`](interfaces_executed_migration.ExecutedMigration.md)[]\>

Get migrations that have been migrated.

#### Returns

`Promise`<[`ExecutedMigration`](interfaces_executed_migration.ExecutedMigration.md)[]\>

#### Defined in

[interfaces/registry.ts:8](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/interfaces/registry.ts#L8)

---

### setExecutedMigrations

▸ **setExecutedMigrations**(`data`): `Promise`<`void`\>

Set executed migrations.

This is how we keep track of what has been and has not been migrated.

#### Parameters

| Name   | Type                                                             | Description      |
| :----- | :--------------------------------------------------------------- | :--------------- |
| `data` | [`RegistryUpdate`](interfaces_registry_update.RegistryUpdate.md) | Updated details. |

#### Returns

`Promise`<`void`\>

#### Defined in

[interfaces/registry.ts:17](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/interfaces/registry.ts#L17)
