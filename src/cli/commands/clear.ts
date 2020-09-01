import { Migr8 } from '../../migr8';
import { down } from './down';

export const clear = async (migr8: Migr8) => {
  const num = (await migr8.registry.getExecutedMigrations()).length;
  return await down(migr8, num);
};
