import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import handler from './handler';

type RequestCookies = {
  refreshToken: string;
};
type ResponseCookie = Partial<RequestCookies>;

const getResponse = async (
  request: HandlerEvent<any, any, any, RequestCookies>,
): Promise<HandlerResponse<string, ResponseCookie>> => {
  const { refreshToken } = request.cookies;
  await handler(refreshToken);

  return {
    status: {
      code: StatusCodes.OK,
    },
    body: 'User logout',
    cookie: {
      refreshToken: undefined,
    },
  };
};

export default getResponse;
