import Exception from '..';
import { ExceptionCodes } from '../exception-codes';
import { StatusCodes } from '../../constants/status-codes';

type NotFoundExceptionData = {
  message?: string;
};

export default class NotFound extends Exception {
  constructor({ message }: NotFoundExceptionData = {}) {
    super({
      message: message ?? 'Not Found',
      code: ExceptionCodes.NOT_FOUND,
      status: { code: StatusCodes.NOT_FOUND },
    });
  }
}
