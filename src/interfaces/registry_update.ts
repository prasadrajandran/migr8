import { ExecutedMigration } from './executed_migration';

export interface RegistryUpdate {
  /**
   * Operation that was performed.
   */
  direction: 'up' | 'down';

  /**
   * All executed migrations.
   */
  migrations: ExecutedMigration[];

  /**
   * Migration that was either executed or rolled back.
   */
  migration: ExecutedMigration;
}
