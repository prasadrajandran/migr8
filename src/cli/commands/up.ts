import Migr8 from '../../migr8';
import * as logger from '../helpers/logger';
import findMaxStrLength from '../helpers/find_max_str_length';

const up = async (migr8: Migr8, num: number) => {
  const { migrations, err } = await migr8.up({ num });
  const padding = findMaxStrLength(migrations.map(({ batch }) => batch));

  for (const { name, batch } of migrations) {
    const status = `Migrated  Batch ${String(batch).padStart(padding, '0')}`;
    logger.inform(`${status}  ${name}`);
  }
  if (err) {
    logger.scream(err);
  } else if (!migrations.length) {
    logger.inform('Nothing to migrate.');
  }

  return err || true;
};

export default up;
