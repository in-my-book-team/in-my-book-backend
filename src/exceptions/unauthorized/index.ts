import Exception from '..';
import { ExceptionCodes } from '../exception-codes';
import { StatusCodes } from '../../constants/status-codes';

type UnauthorizedExceptionData = {
  message?: string;
};

export default class Unauthorized extends Exception {
  constructor({ message }: UnauthorizedExceptionData = {}) {
    super({
      message: message ?? 'Unauthorized',
      code: ExceptionCodes.UNAUTHORIZED,
      status: { code: StatusCodes.UNAUTHORIZED },
    });
  }
}
