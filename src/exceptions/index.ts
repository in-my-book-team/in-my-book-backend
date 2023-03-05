import { StatusCodes } from '../constants/status-codes';

module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(StatusCodes.UNAUTHORIZED, 'USER IS NOT UNAUTHORIZED');
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, errors);
  }
};
