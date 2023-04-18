import { validationResult } from 'express-validator';
import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

type Query = {
  email: string;
  password: string;
};

const loginHandler = async (
  request: HandlerEvent,
): Promise<HandlerResponse> => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return new BadRequest({ message: errors.array().join('\n') });
    }

    const { email, password } = request.query as Query;
    const userData = await UserService.login(email, password);

    return {
      status: {
        code: StatusCodes.OK,
      },
      body: userData,
      cookie: {
        refreshToken: userData.tokens.refresh,
      },
    };
  } catch (error) {
    return new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default loginHandler;
