import type { Server } from 'http';
import cors from 'cors';
import express from 'express';

const startServer = (port = 3000): Promise<Server> => {
  const app = express();

  app.use(express.json());
  app.options('*', cors());

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        console.log(`Listening on port=${port}`);
        resolve(server);
      });
    } catch (error: any) {
      console.error(error.message);
      reject(error);
    }
  });
};

startServer(3000); // TODO: move port to .env
