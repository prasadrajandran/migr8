import ExecutedMigration from './executed_migration';

export default interface DownedMigrations {
  /**
   * Migrations that were rollbacked.
   */
  migrations: ExecutedMigration[];

  /**
   * Reference to the Error if an error occured.
   */
  err: Error | null;
}
