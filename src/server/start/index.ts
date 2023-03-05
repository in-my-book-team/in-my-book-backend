import type { Server } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from '../../middlewares';
import getConnection from '../../services/db/utils/getConnection';
import router from '../routes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const startServer = (): Promise<Server> => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.options('*', cors);
  app.use('/api', router);
  app.use(errorMiddleware);

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(PORT, () => {
        getConnection();
        console.log(`Listening on port=${PORT}`);
        resolve(server);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export default startServer;
