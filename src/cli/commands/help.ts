import * as fs from 'fs';
import * as path from 'path';
import * as logger from '../helpers/logger';

export const help = async () => {
  const manFilename = path.resolve(__dirname, '../man');
  const man = fs.readFileSync(path.resolve(__dirname, '../man'), {
    encoding: 'utf8',
    flag: 'r',
  });
  logger.inform(man);
};
