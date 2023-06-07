import type { DataSourceOptions } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const getConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: true,
  entities: [`${__dirname}/../../entities/**/*{.ts,.js}`],
  migrations: [`${__dirname}/../../migrations/**/*{.ts,.js}`],
});

export default getConfig;
