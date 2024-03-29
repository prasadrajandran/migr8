import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Registry } from '../interfaces/registry';
import { ExecutedMigration } from '../interfaces/executed_migration';
import { RegistryUpdate } from '../interfaces/registry_update';
import { FileSystemRegistryConstructor } from '../interfaces/file_system_registry_constructor';

const DEFAULT_REGISTRY_FILENAME = './migr8.registry.json';

export class FileSystemRegistry implements Registry {
  /**
   * File encoding of the registry.
   */
  registryFileEncoding: 'utf8' = 'utf8';

  /**
   * Filename (including the path) of the registry file.
   */
  registryFilename: string;

  /**
   * Construct a new File System Registry Driver.
   *
   * @param arg - Constructor arg.
   */
  constructor({
    registryDir,
    registryFilename,
  }: FileSystemRegistryConstructor = {}) {
    this.registryFilename = resolve(
      registryDir || process.cwd(),
      registryFilename || DEFAULT_REGISTRY_FILENAME,
    );
  }

  /**
   * Get migrations that have been migrated.
   */
  async getExecutedMigrations(): Promise<ExecutedMigration[]> {
    if (!existsSync(this.registryFilename)) {
      return [];
    }
    return JSON.parse(
      readFileSync(this.registryFilename, {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  /**
   * Set executed migrations.
   *
   * @param update - Updated details.
   */
  async setExecutedMigrations({ migrations }: RegistryUpdate): Promise<void> {
    writeFileSync(this.registryFilename, JSON.stringify(migrations), {
      encoding: this.registryFileEncoding,
      flag: 'w+',
    });
  }
}
