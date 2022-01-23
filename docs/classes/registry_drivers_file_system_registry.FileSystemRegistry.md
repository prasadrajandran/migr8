[migr8 - v1.0.1](../README.md) / [registry_drivers/file_system_registry](../modules/registry_drivers_file_system_registry.md) / FileSystemRegistry

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

• **new FileSystemRegistry**(`arg?`)

Construct a new File System Registry Driver.

#### Parameters

| Name  | Type                                                                                                                          | Description      |
| :---- | :---------------------------------------------------------------------------------------------------------------------------- | :--------------- |
| `arg` | [`FileSystemRegistryConstructor`](../interfaces/interfaces_file_system_registry_constructor.FileSystemRegistryConstructor.md) | Constructor arg. |

#### Defined in

[registry_drivers/file_system_registry.ts:26](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/registry_drivers/file_system_registry.ts#L26)

## Properties

### registryFileEncoding

• **registryFileEncoding**: `"utf8"`

File encoding of the registry.

#### Defined in

[registry_drivers/file_system_registry.ts:14](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/registry_drivers/file_system_registry.ts#L14)

---

### registryFilename

• **registryFilename**: `string`

Filename (including the path) of the registry file.

#### Defined in

[registry_drivers/file_system_registry.ts:19](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/registry_drivers/file_system_registry.ts#L19)

## Methods

### getExecutedMigrations

▸ **getExecutedMigrations**(): `Promise`<[`ExecutedMigration`](../interfaces/interfaces_executed_migration.ExecutedMigration.md)[]\>

Get migrations that have been migrated.

#### Returns

`Promise`<[`ExecutedMigration`](../interfaces/interfaces_executed_migration.ExecutedMigration.md)[]\>

#### Implementation of

[Registry](../interfaces/interfaces_registry.Registry.md).[getExecutedMigrations](../interfaces/interfaces_registry.Registry.md#getexecutedmigrations)

#### Defined in

[registry_drivers/file_system_registry.ts:39](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/registry_drivers/file_system_registry.ts#L39)

---

### setExecutedMigrations

▸ **setExecutedMigrations**(`update`): `Promise`<`void`\>

Set executed migrations.

#### Parameters

| Name     | Type                                                                           | Description      |
| :------- | :----------------------------------------------------------------------------- | :--------------- |
| `update` | [`RegistryUpdate`](../interfaces/interfaces_registry_update.RegistryUpdate.md) | Updated details. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Registry](../interfaces/interfaces_registry.Registry.md).[setExecutedMigrations](../interfaces/interfaces_registry.Registry.md#setexecutedmigrations)

#### Defined in

[registry_drivers/file_system_registry.ts:56](https://github.com/prasadrajandran/migr8/blob/b5f0cc2/src/registry_drivers/file_system_registry.ts#L56)
