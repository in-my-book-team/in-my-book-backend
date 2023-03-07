import { ExceptionCodes } from './exception-codes';
import { StatusCodes } from '../constants/status-codes';

type ExceptionData = {
  message?: string;
  code: ExceptionCodes;
  status: {
    code: StatusCodes;
  };
};

export type ExceptionObject = Omit<ExceptionData, 'status'>;

export default class Exception extends Error {
  code: ExceptionCodes;

  status: { code: StatusCodes };

  constructor({ message, code, status }: ExceptionData) {
    super(message ?? 'Something went wrong');

    this.code = code ?? ExceptionCodes.UNEXPECTED;
    this.status = status ?? { code: StatusCodes.INTERNAL_SERVER_ERROR };
  }

  get obj(): ExceptionObject {
    return { message: this.message, code: this.code };
  }
}
