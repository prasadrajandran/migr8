import { Migr8 } from '../../migr8';
import * as logger from '../helpers/logger';
import { findMaxStrLength } from '../helpers/find_max_str_length';

export const list = async (migr8: Migr8) => {
  const executedMigrations = await migr8.registry.getExecutedMigrations();
  const padding = findMaxStrLength(
    executedMigrations.map(({ batch }) => batch),
  );

  for (const migration of await migr8.getMigrations()) {
    const executed = executedMigrations.find(({ name }) => migration === name);

    let status = '';
    if (executed) {
      String(executed.batch).padStart(padding, '0');
      status = `Migrated  Batch ${String(executed.batch).padStart(
        padding,
        '0',
      )}`;
    } else {
      status = 'Pending';
    }

    logger.inform(`${status}  ${migration}`);
  }

  return true;
};
