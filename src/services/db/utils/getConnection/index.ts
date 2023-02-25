import { DataSource, DataSourceOptions } from 'typeorm';

const getConnection = (config: DataSourceOptions): void => {
  try {
    const dbInstanse = /* cache.DB ?? */ new DataSource(config); // TODO: implement cache

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
