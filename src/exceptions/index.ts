import { StatusCodes } from '../constants/status-codes';

class Exceptions extends Error {
  status;

  errors;

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(): Exceptions {
    return new Exceptions(StatusCodes.UNAUTHORIZED, 'USER IS NOT UNAUTHORIZED');
  }

  static BadRequest(message: string, errors: any = []): Exceptions {
    return new Exceptions(StatusCodes.BAD_REQUEST, message, errors);
  }
}

export default Exceptions;
