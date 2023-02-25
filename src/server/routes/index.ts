import type { Application } from 'express';
import handleRequest from '../request-handler';
import healthCheckHandler from '../../handlers/health-check';

const routes = (app: Application): void => {
  app.get('/health-check', handleRequest(healthCheckHandler));
};

export default routes;
