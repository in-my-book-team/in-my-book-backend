import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../constants/status-codes';
import { ExceptionCodes } from '../exceptions/exception-codes';
const ApiError = require('../exceptions/index');

module.exports = function (
  err: { status: number; message: any; errors: any },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: ExceptionCodes.UNEXPECTED, errors: err.errors });
};
