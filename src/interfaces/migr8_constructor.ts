import { UpArg } from './up_arg';
import { DownArg } from './down_arg';
import { Registry } from './registry';

export interface Migr8Constructor {
  /**
   * Directory that contains the migration files.
   */
  migrationsDir: string;

  /**
   * Filename of the template that will be used for new migrations.
   */
  templateFilename: string;

  /**
   * Registry driver that allows us to query the registry for executed
   * migrations.
   */
  registry: Registry;

  /**
   * Callback that produces an argument for migrations when they are being
   * migrated.
   */
  upArg: UpArg;

  /**
   * Callback that produces an argument for migrations when they are being
   * rollbacked.
   */
  downArg: DownArg;
}
