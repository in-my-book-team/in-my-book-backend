import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ENVS } from '../../../../constants';
import localConfig from '../../../../../db.local.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const commonConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  entities: [`${__dirname}/../../entities/*{.ts,.js}`],
  // entities: [User, Token],
  synchronize: true,
  // migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
};

const getConfig = (): PostgresConnectionOptions =>
  process.env.ENV === ENVS.PROD
    ? {
        ...commonConfig,
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      }
    : {
        ...commonConfig,
        ...localConfig,
      };

export default getConfig;
