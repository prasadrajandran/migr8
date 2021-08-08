import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from 'fs';
import { resolve, dirname } from 'path';
import { Migr8Constructor } from './interfaces/migr8_constructor';
import { Registry } from './interfaces/registry';
import { UppedMigrations } from './interfaces/upped_migrations';
import { DownedMigrations } from './interfaces/downed_migrations';
import { UpArg } from './interfaces/up_arg';
import { DownArg } from './interfaces/down_arg';
import { FileSystemRegistry } from './registry_drivers/file_system_registry';

const DEFAULT_TEMPLATE_FILENAME = resolve(__dirname, 'migration_template.js');
const DEFAULT_MIGRATIONS_DIR = './migrations';

interface UpOptions {
  /**
   * The maximum number of migrations to execute.
   */
  num?: number;
}

interface DownOptions {
  /**
   * The maximum number of migratons to rollback.
   */
  num?: number;
}

export class Migr8 {
  /**
   * File encoding for the migration files.
   */

  migrationFileEncoding: 'utf8' = 'utf8';

  /**
   * Absolute path to the folder housing the migrations.
   */

  migrationsDir: string;

  /**
   * Absolute path to the template for new migrations.
   */

  templateFilename: string;

  /**
   * Registry driver that allows us to query the registry for executed
   * migrations.
   */
  registry: Registry;

  /**
   * Callback that is executed to produce an argument that will be passed to
   * migrations when they are being migrated.
   */

  upArg: UpArg;

  /**
   * Callback that is executed to produce an argument that will be passed to
   * migrations when they are being rolledback.
   */

  downArg: DownArg;

  /**
   * Create a new Migr8 instance.
   *
   * @param arg - Constructor arg.
   */
  constructor({
    migrationsDir,
    templateFilename,
    registry,
    upArg,
    downArg,
  }: Migr8Constructor = {}) {
    this.migrationsDir = resolve(migrationsDir || DEFAULT_MIGRATIONS_DIR);
    this.templateFilename = templateFilename
      ? resolve(templateFilename)
      : DEFAULT_TEMPLATE_FILENAME;
    this.registry = registry || new FileSystemRegistry();
    this.upArg = upArg || (async () => undefined);
    this.downArg = downArg || (async () => undefined);
  }

  /**
   * Create a new migration file.
   *
   * @param migrationName - Name (not including the path) of the migration.
   * @returns Promise that resolves to the filename of the migration that was
   *     created.
   */
  async create(migrationName: string): Promise<string> {
    const filename = await this.createFilename(migrationName);
    const template = readFileSync(this.templateFilename, {
      encoding: this.migrationFileEncoding,
      flag: 'r',
    });

    const migrationsDir = dirname(filename);
    if (!existsSync(migrationsDir)) {
      mkdirSync(migrationsDir, { recursive: true });
    }

    writeFileSync(filename, template, {
      encoding: this.migrationFileEncoding,
      flag: 'wx',
    });

    return filename;
  }

  /**
   * Run pending migrations.
   *
   * @param options - Options to adjust the operation.
   * @returns Results of the migration.
   */
  async up({ num }: UpOptions = {}): Promise<UppedMigrations> {
    const executedMigrations = await this.registry.getExecutedMigrations();

    let batch = 1;
    if (executedMigrations.length) {
      batch = executedMigrations[executedMigrations.length - 1].batch + 1;
    }

    const arg = await this.upArg();
    const processedMigrations = [];
    const limit = ((num || 0) > 0 ? num : Infinity) as number;
    let err = null;
    let count = 0;
    try {
      for (const name of await this.getPendingMigrations()) {
        if (++count > limit) {
          break;
        }

        const filename = resolve(this.migrationsDir, name);
        const file = await import(/* webpackIgnore: true */ filename);
        await file.up(arg);

        const migration = {
          name,
          batch,
          migratedAt: new Date().getTime(),
        };

        executedMigrations.push(migration);
        processedMigrations.push(migration);

        await this.registry.setExecutedMigrations({
          direction: 'up',
          migrations: executedMigrations,
          migration,
        });
      }
    } catch (e) {
      err = e;
    }

    return { migrations: processedMigrations, err };
  }

  /**
   * Rollback latest batch of executed migrations.
   *
   * @param options - Options to adjust the operation.
   * @returns Results of the rollback.
   */
  async down({ num }: DownOptions = {}): Promise<DownedMigrations> {
    const executedMigrations = await this.registry.getExecutedMigrations();
    const limit = ((num || 0) > 0 ? num : Infinity) as number;

    let batch = 0;
    if (!Number.isFinite(limit) && executedMigrations.length) {
      batch = executedMigrations[executedMigrations.length - 1].batch;
    }

    const arg = await this.downArg();
    const processedMigrations = [];
    let err = null;
    let count = 0;
    try {
      // Note: The `slice` is intentional since `reverse()` would operate on the
      // array "in place" and we still need `executedMigrations` in the original
      // order.
      for (const migration of executedMigrations.slice().reverse()) {
        if (Number.isFinite(limit)) {
          batch = migration.batch;
        }

        if (++count > limit || batch !== migration.batch) {
          break;
        }

        const filename = resolve(this.migrationsDir, migration.name);
        const file = await import(/* webpackIgnore: true */ filename);
        await file.down(arg);

        executedMigrations.pop();
        await this.registry.setExecutedMigrations({
          direction: 'down',
          migrations: executedMigrations,
          migration,
        });

        processedMigrations.push(migration);
      }
    } catch (e) {
      err = e;
    }

    return { migrations: processedMigrations, err };
  }

  /**
   * Generates a filename (including the path) for a new migration.
   *
   * Timezonze: UTC 00:00.
   *
   * @param migrationName - Name of the migration (without the path).
   * @returns A promise that resolves to the generated filename.
   */
  async createFilename(migrationName: string): Promise<string> {
    const timestamp = new Date()
      .toISOString()
      .replace(/[^\d]/g, '')
      .substring(0, 14); // Remove milliseconds.

    let extension = '';
    const extensionMatch = this.templateFilename.match(/\.[^.]+$/);
    if (extensionMatch) {
      extension = extensionMatch.pop() || '';
    }

    return resolve(
      this.migrationsDir,
      `${timestamp}_${migrationName}${extension}`,
    );
  }

  /**
   * Get all the migrations.
   *
   * @returns Migration filenames (not including the path).
   */
  async getMigrations(): Promise<string[]> {
    if (!existsSync(this.migrationsDir)) {
      return [];
    }
    return readdirSync(this.migrationsDir, {
      encoding: this.migrationFileEncoding,
    }).sort();
  }

  /**
   * Get migrations that have not been migrated.
   *
   * @returns Pending migration filenames (not including the path).
   */
  async getPendingMigrations(): Promise<string[]> {
    const executedMigrations = new Set(
      (await this.registry.getExecutedMigrations()).map(({ name }) => name),
    );
    return (await this.getMigrations()).filter(
      (name) => !executedMigrations.has(name),
    );
  }
}
