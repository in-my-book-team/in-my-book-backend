import { DataSource } from 'typeorm';
import getConfig from './config';

export const dbInstanse = new DataSource(getConfig());

const getConnection = (): void => {
  try {
    dbInstanse
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  } catch (error) {
    console.error('Error connecting to database', error);
  }
};

export default getConnection;
