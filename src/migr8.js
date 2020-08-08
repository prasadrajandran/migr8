const fs = require('fs');
const path = require('path');

/**
 * @callback UpArg
 * @returns {Promise<any>}
 */

/**
 * @callback DownArg
 * @returns {Promise<any>}
 */

/**
 * @typedef Migr8Constructor
 * @property {string} migrationDir Directory that contains the migration files.
 * @property {string} templateFilename Filename of the template that will be
 *     used for new migrations.
 * @property {string} registryFilename Filename of the registry file that is
 *     used to keep track of all executed migrations.
 * @property {UpArg=} upArg Callback that produces an argument
 *     for migrations when they are being migrated.
 * @property {DownArg=} downArg Callback that produces an
 *     argument for migrations when they are being rollbacked.
 */

/**
 * @typedef ExecutedMigration
 * @property {string} name Name of the migration.
 * @property {number} batch Migration batch.
 * @property {number} migratedAt Unix timestamp of when the migration was
 *     executed.
 */

/**
 * @typedef UpMigration
 * @property {ExecutedMigration[]} migrations Migrations that were migrated.
 * @property {Error?} err Reference to the Error if an error occured.
 */

/**
 * @typedef DownMigration
 * @property {ExecutedMigration[]} migrations Migrations that were rollbacked.
 * @property {Error?} err Reference to the Error if an error occured.
 */

/**
 * @typedef RegistryUpdate
 * @property {'up'|'down'} direction Operation that was performed.
 * @property {ExecutedMigration[]} migrations All executed migrations.
 * @property {ExecutedMigration} migration Migration that was either executed
 *     or rollbacked.
 */

class Migr8 {
  /**
   * Create a new Migr8 instance.
   *
   * @param {Migr8Constructor} arg Constructor arg.
   */
  constructor({
    migrationsDir,
    templateFilename,
    registryFilename,
    upArg = async () => {},
    downArg = async () => {},
  }) {
    /**
     * File encoding for the migration files.
     *
     * @type {string}
     */
    this.migrationFileEncoding = 'utf8';

    /**
     * File encoding for the registry file.
     *
     * @type {string}
     */
    this.registryFileEncoding = 'utf8';

    /**
     * Absolute path to the folder housing the migrations.
     *
     * @type {string}
     */
    this.migrationsDir = path.resolve(migrationsDir);

    /**
     * Absolute path to the template for new migrations.
     *
     * @type {string}
     */
    this.templateFilename = path.resolve(templateFilename);

    /**
     * Absolute path to the registry file. The registry is what we use to keep
     * track of what has been migrated.
     *
     * @type {string}
     */
    this.registryFilename = path.resolve(registryFilename);

    /**
     * Callback that is executed to produce an argument that will be passed to
     * migrations when they are being migrated.
     *
     * @type {UpArg}
     */
    this.upArg = upArg;

    /**
     * Callback that is executed to produce an argument that will be passed to
     * migrations when they are being rollbacked.
     *
     * @type {DownArg}
     */
    this.downArg = downArg;
  }

  /**
   * Create a new migration file.
   *
   * @param {string} migrationName Name (not including the path) of the
   *     migration.
   * @returns {Promise<string>} Promise that resolves to the filename of the
   *     migration that was created.
   */
  async create(migrationName) {
    const filename = await this.createFilename(migrationName);
    const template = fs.readFileSync(this.templateFilename, {
      encoding: this.migrationFileEncoding,
      flag: 'r',
    });

    fs.writeFileSync(filename, template, {
      encoding: this.migrationFileEncoding,
      flag: 'wx',
    });

    return filename;
  }

  /**
   * Run pending migrations.
   *
   * @param {{ num: number? }=} options Adjust the number of migrations that
   *     should be migrated.
   * @returns {Promise<UpMigration>} Results of the migration.
   */
  async up({ num = null } = {}) {
    const executedMigrations = await this.getExecutedMigrations();

    let batch = 1;
    if (executedMigrations.length) {
      batch = executedMigrations[executedMigrations.length - 1].batch + 1;
    }

    const arg = await this.upArg();
    const processedMigrations = [];
    const limit = num > 0 ? num : Infinity;
    let err = null;
    let count = 0;
    try {
      for (const name of await this.getPendingMigrations()) {
        if (++count > limit) {
          break;
        }

        const filename = path.resolve(this.migrationsDir, name);

        require(filename).up(arg);

        const migration = {
          name,
          batch,
          migratedAt: new Date().getTime(),
        };

        executedMigrations.push(migration);
        processedMigrations.push(migration);

        await this.updateRegistry({
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
   * @param {{ num: number? }=} options Adjust the number of migrations to
   *     rollback.
   * @returns {Promise<DownMigration>} Results of the rollback.
   */
  async down({ num = null } = {}) {
    const executedMigrations = await this.getExecutedMigrations();
    const limit = num > 0 ? num : Infinity;

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

        const filename = path.resolve(this.migrationsDir, migration.name);

        await require(filename).down(arg);

        executedMigrations.pop();
        await this.updateRegistry({
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
   * @param {string} migrationName Name of the migration (without the path).
   * @returns {Promise<string>} A promise that resolves to the generated
   *     filename.
   */
  async createFilename(migrationName) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[^\d]/g, '')
      .substring(0, 14); // Remove milliseconds.
    return path.resolve(this.migrationsDir, `${timestamp}_${migrationName}.js`);
  }

  /**
   * Get all the migrations.
   *
   * @returns {Promise<string[]>} Migration filenames (not including the path).
   */
  async getMigrations() {
    return fs
      .readdirSync(this.migrationsDir, { encoding: this.migrationFileEncoding })
      .sort();
  }

  /**
   * Get migrations that have been migrated.
   *
   * @returns {Promise<ExecutedMigration[]>} Executed migrations.
   */
  async getExecutedMigrations() {
    if (!fs.existsSync(this.registryFilename)) {
      return [];
    }
    return JSON.parse(
      fs.readFileSync(this.registryFilename, {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  /**
   * Get migrations that have not been migrated.
   *
   * @returns {Promise<string[]>} Pending migration filenames (not including the
   *     path).
   */
  async getPendingMigrations() {
    const executedMigrations = new Set(
      (await this.getExecutedMigrations()).map(({ name }) => name),
    );
    return (await this.getMigrations()).filter(
      (name) => !executedMigrations.has(name),
    );
  }

  /**
   * Update the registry.
   *
   * This is how we keep track of what has been and has not been migrated.
   *
   * @param {RegistryUpdate} update Updated details.
   * @returns {Promise<void>}
   */
  async updateRegistry({ migrations }) {
    fs.writeFileSync(this.registryFilename, JSON.stringify(migrations), {
      encoding: this.registryFileEncoding,
      flag: 'w+',
    });
  }
}

module.exports = Migr8;
