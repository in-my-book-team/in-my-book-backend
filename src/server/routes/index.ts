import { body } from 'express-validator';
import { Router } from 'express';
import UserController from '../../controllers/userController';

const router = Router();

router.post(
  '/registration',
  body('email', 'Invalid email').isEmail(),
  body(
    'password',
    'Minimum eight characters and maximum 253. At least one letter, one number and one special character',
  )
    .isLength({ min: 8, max: 253 })
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
    ),
  UserController.registration,
);
router.get('/activate/:link', UserController.activate);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default router;
