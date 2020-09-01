import { Migr8 } from '../../migr8';
import { up } from './up';
import { clear } from './clear';

export const reset = async (migr8: Migr8) => {
  if ((await clear(migr8)) === true) {
    await up(migr8);
  }
};
