[migr8 - v1.0.0-alpha.1](../README.md) / [registry_drivers/file_system_registry](../modules/registry_drivers_file_system_registry.md) / FileSystemRegistry

# Class: FileSystemRegistry

[registry_drivers/file_system_registry](../modules/registry_drivers_file_system_registry.md).FileSystemRegistry

## Implements

- [`Registry`](../interfaces/interfaces_registry.Registry.md)

## Table of contents

### Constructors

- [constructor](registry_drivers_file_system_registry.FileSystemRegistry.md#constructor)

### Properties

- [registryFileEncoding](registry_drivers_file_system_registry.FileSystemRegistry.md#registryfileencoding)
- [registryFilename](registry_drivers_file_system_registry.FileSystemRegistry.md#registryfilename)

### Methods

- [getExecutedMigrations](registry_drivers_file_system_registry.FileSystemRegistry.md#getexecutedmigrations)
- [setExecutedMigrations](registry_drivers_file_system_registry.FileSystemRegistry.md#setexecutedmigrations)

## Constructors

### constructor

• **new FileSystemRegistry**(`registryFilename?`)

Construct a new File System Registry Driver.

#### Parameters

| Name                | Type     | Description                                         |
| :------------------ | :------- | :-------------------------------------------------- |
| `registryFilename?` | `string` | Filename (including the path) of the registry file. |

#### Defined in

[registry_drivers/file_system_registry.ts:26](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/registry_drivers/file_system_registry.ts#L26)

## Properties

### registryFileEncoding

• **registryFileEncoding**: `"utf8"`

File encoding of the registry.

#### Defined in

[registry_drivers/file_system_registry.ts:13](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/registry_drivers/file_system_registry.ts#L13)

---

### registryFilename

• **registryFilename**: `string`

Filename (including the path) of the registry file.

#### Defined in

[registry_drivers/file_system_registry.ts:18](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/registry_drivers/file_system_registry.ts#L18)

## Methods

### getExecutedMigrations

▸ **getExecutedMigrations**(): `Promise`<[`ExecutedMigration`](../interfaces/interfaces_executed_migration.ExecutedMigration.md)[]\>

Get migrations that have been migrated.

#### Returns

`Promise`<[`ExecutedMigration`](../interfaces/interfaces_executed_migration.ExecutedMigration.md)[]\>

#### Implementation of

[Registry](../interfaces/interfaces_registry.Registry.md).[getExecutedMigrations](../interfaces/interfaces_registry.Registry.md#getexecutedmigrations)

#### Defined in

[registry_drivers/file_system_registry.ts:35](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/registry_drivers/file_system_registry.ts#L35)

---

### setExecutedMigrations

▸ **setExecutedMigrations**(`__namedParameters`): `Promise`<`void`\>

Set executed migrations.

#### Parameters

| Name                | Type                                                                           |
| :------------------ | :----------------------------------------------------------------------------- |
| `__namedParameters` | [`RegistryUpdate`](../interfaces/interfaces_registry_update.RegistryUpdate.md) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Registry](../interfaces/interfaces_registry.Registry.md).[setExecutedMigrations](../interfaces/interfaces_registry.Registry.md#setexecutedmigrations)

#### Defined in

[registry_drivers/file_system_registry.ts:52](https://github.com/prasadrajandran/migr8/blob/cdd896d/src/registry_drivers/file_system_registry.ts#L52)
