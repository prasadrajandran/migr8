import Migr8 from '../../migr8';
import up from './up';
import clear from './clear';

const reset = async (migr8: Migr8) => {
  if ((await clear(migr8)) === true) {
    await up(migr8);
  }
};

export default reset;
