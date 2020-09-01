import { ExecutedMigration } from './executed_migration';

export interface UppedMigrations {
  /**
   * Migrations that were migrated.
   */
  migrations: ExecutedMigration[];

  /**
   * Reference to the Error if an error occured.
   */
  err: Error | null;
}
