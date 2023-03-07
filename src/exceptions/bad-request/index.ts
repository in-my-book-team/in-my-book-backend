import Exception from '..';
import { ExceptionCodes } from '../exception-codes';
import { StatusCodes } from '../../constants/status-codes';

type BadRequestExceptionData = {
  message?: string;
};

export default class BadRequest extends Exception {
  constructor({ message }: BadRequestExceptionData = {}) {
    super({
      message: message ?? 'Bad request exception',
      code: ExceptionCodes.BAD_REQUEST,
      status: { code: StatusCodes.BAD_REQUEST },
    });
  }
}
