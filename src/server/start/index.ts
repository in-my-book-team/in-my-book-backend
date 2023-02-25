import express, { Application } from 'express';
import type { Server } from 'http';
import cors from 'cors';

const startServer = (
  routes: (app: Application) => void,
  port = 5000,
): Promise<Server> => {
  const app = express();

  app.use(express.json());
  app.options('*', cors());

  routes(app);

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        console.log(`Listening on port=${port}`);
        resolve(server);
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

export default startServer;
