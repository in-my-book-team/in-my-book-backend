import { DataSource } from 'typeorm';
import getConfig from './config';

export const myDataSource = new DataSource(getConfig());

const getConnection = (): void => {
  try {
    myDataSource
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
