import { Migr8 } from '../../migr8';
import * as logger from '../helpers/logger';

export const create = async (migr8: Migr8, migrationName: string) => {
  if (!migrationName) {
    logger.warn('A name is required to create a migration.');
    return;
  }
  logger.inform(`Created "${await migr8.create(migrationName)}"`);

  return true;
};
