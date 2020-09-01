export interface ExecutedMigration {
  /**
   * Name of the migration.
   */
  name: string;

  /**
   * Batch the executed migration belongs to.
   */
  batch: number;

  /**
   * Unix timestamp of when the migration was executed.
   */
  migratedAt: number;
}
