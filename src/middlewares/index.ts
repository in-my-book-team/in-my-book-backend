import type { NextFunction, Request, Response } from 'express';
import Exceptions from '../exceptions/index';
import { ExceptionCodes } from '../exceptions/exception-codes';
import { StatusCodes } from '../constants/status-codes';

/* eslint-disable */

const middlewares = (
  err: { status: number; message: string; errors: any },
  req: Request,
  res: Response,
  next: NextFunction,
): Response<number, Record<string, any>> => {
  console.log(err);
  if (err instanceof Exceptions) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: ExceptionCodes.UNEXPECTED, errors: err.errors });
};
/* eslint-enable */

export default middlewares;
