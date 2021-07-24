import { Migr8 } from '../migr8';
import { Migr8Constructor } from './migr8_constructor';

export interface Migr8Config {
  /**
   * Migr8 instance to use. A modified version could be used as long as it
   * inherits from Migr8 and its API is unchanged. Will default to Migr8.
   */
  Migr8?: typeof Migr8;

  /**
   * Migrations directory. Will default to "migrations" in the current working
   * directory.
   */
  migrationsDir?: Migr8Constructor['migrationsDir'];

  /**
   * Template for the migration files. A default will be used if not specified.
   */
  templateFilename?: Migr8Constructor['templateFilename'];

  /**
   * Registry driver. Will default to the File System Registry driver if not
   * specified.
   */
  registry?: Migr8Constructor['registry'];

  /**
   * Function whose resolved value will be passed to migrations that are being
   * executed. Will default to a function that resolves to undefined.
   */
  upArg?: Migr8Constructor['upArg'];

  /**
   * Function whose resolved value will be passed to migrations that are being
   * rolledback. Will default to a function that resolves to undefined.
   */
  downArg?: Migr8Constructor['downArg'];
}
