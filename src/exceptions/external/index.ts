import Exception from '..';
import { ExceptionCodes } from '../exception-codes';
import { StatusCodes } from '../../constants/status-codes';

type ExternalExceptionData = {
  message?: string;
};

export default class External extends Exception {
  constructor({ message }: ExternalExceptionData = {}) {
    super({
      message: message ?? 'External exception',
      code: ExceptionCodes.BAD_REQUEST,
      status: { code: StatusCodes.BAD_REQUEST },
    });
  }
}
