const Router = require('express').Router;
const UserController = require('../../controllers/userController');
const { body } = require('express-validator');

const router = new Router();

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

module.exports = router;
