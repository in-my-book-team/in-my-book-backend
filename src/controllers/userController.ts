import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Exceptions from '../exceptions';
import UserService from '../services/user-service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class UserController {
  static registration = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(Exceptions.BadRequest('Invalid validation', errors));
      }
      const { nickname, email, password } = req.body;
      const userData = await UserService.registration(
        nickname,
        email,
        password,
      );
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  };

  static activate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(String(process.env.CLIENT_URL));
    } catch (e) {
      next(e);
    }
  };
}

export default UserController;
