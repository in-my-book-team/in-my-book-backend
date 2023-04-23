import type { Application } from 'express';
import handleRequest from '../request-handler';
import healthCheckHandler from '../../handlers/health-check';
import registrationHandler from '../../handlers/registration';
import activateLinkHandler from '../../handlers/activate';
import loginHandler from '../../handlers/login';
import logoutHandler from '../../handlers/logout';

const routes = (app: Application): void => {
  app.get('/health-check', handleRequest(healthCheckHandler));
  app.post('/registration', handleRequest(registrationHandler));
  app.get('/activate/:link', handleRequest(activateLinkHandler));
  app.post('/login', handleRequest(loginHandler));
  app.post('/logout', handleRequest(logoutHandler));
};

export default routes;
