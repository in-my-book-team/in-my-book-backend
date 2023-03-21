import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

const logoutHandler = async (
  request: HandlerEvent,
): Promise<HandlerResponse> => {
  try {
    const { refreshToken } = request.cookies;
    await UserService.logout(refreshToken);
    return {
      status: {
        code: StatusCodes.OK,
      },
      body: 'User logout',
      cookie: {
        refreshToken: '',
      },
    };
  } catch (error) {
    return new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default logoutHandler;
