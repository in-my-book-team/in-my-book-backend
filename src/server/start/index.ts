require('dotenv').config();
import express, { Application } from 'express';
import type { Server } from 'http';
import getConnection from '../../services/db/utils/getConnection';
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('../../middlewares/index');
const router = require('../routes/index');

const startServer = (): Promise<Server> => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.options(cors());
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
