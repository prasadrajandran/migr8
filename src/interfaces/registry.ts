import ExecutedMigration from './executed_migration';
import RegistryUpdate from './registry_update';

export default interface Registry {
  /**
   * Get migrations that have been migrated.
   */
  getExecutedMigrations(): Promise<ExecutedMigration[]>;

  /**
   * Set executed migrations.
   *
   * This is how we keep track of what has been and has not been migrated.
   *
   * @param data Updated details.
   */
  setExecutedMigrations(data: RegistryUpdate): Promise<void>;
}
