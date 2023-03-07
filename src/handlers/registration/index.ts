import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import type { HandlerResponse } from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

export const handler = async (
  req: Request,
  res: Response,
): Promise<HandlerResponse> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new BadRequest({ message: errors.array().join('\n') });
    }

    const { nickname, email, password } = req.body;
    const userData = await UserService.registration(nickname, email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      status: {
        code: StatusCodes.OK,
      },
      body: userData,
    };
  } catch (error) {
    return new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};
