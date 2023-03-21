import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

const activateLinkHandler = async (
  request: HandlerEvent,
): Promise<HandlerResponse> => {
  try {
    const activationLink = request.params.link;
    await UserService.activate(activationLink);
    return {
      status: {
        code: StatusCodes.OK,
      },
      body: 'User Activated',
      redirect: true,
    };
  } catch (error) {
    return new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default activateLinkHandler;
