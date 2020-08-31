import ExecutedMigration from './executed_migration';

export default interface UppedMigrations {
  /**
   * Migrations that were migrated.
   */
  migrations: ExecutedMigration[];

  /**
   * Reference to the Error if an error occured.
   */
  err: Error | null;
}
