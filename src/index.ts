import startServer from './server/start';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error(`uncaughtException: ${err.message}`, err);
  process.exit(1);
});

const startApplication = async (): Promise<void> =>
  startServer()
    .then(() => console.info('Application up and running'))
    .catch((error) => {
      console.error('Unable to run application', error);
      process.exit(1);
    });

startApplication();
