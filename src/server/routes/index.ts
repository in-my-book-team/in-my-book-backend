import type { Application } from 'express';
import UserController from '../../controllers/userController';
import handleRequest from '../request-handler';
import healthCheckHandler from '../../handlers/health-check';
import registrationHandler from '../../handlers/registration';
import { validate } from '../../handlers/registration/validate';

const routes = (app: Application): void => {
  app.get('/health-check', handleRequest(healthCheckHandler));
  app.post('/registration', validate, handleRequest(registrationHandler));
  app.get('/activate/:link', handleRequest(activateLinkHandler));
  app.post('/login', handleRequest(loginHandler));
  app.post('/logout', handleRequest(logoutHandler));
};

router.post(
  '/registration',

  UserController.registration,
);
router.get('/activate/:link', UserController.activate);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default routes;
