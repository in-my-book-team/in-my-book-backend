import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import handler from './handler';

type RequestParams = {
  link: string;
};
type ResponseBody = Awaited<ReturnType<typeof handler>>;

const getResponse = async (
  request: HandlerEvent<any, any, RequestParams, any>,
): Promise<HandlerResponse<ResponseBody, any>> => {
  const { link } = request.params;
  const result = await handler(link);

  return {
    status: {
      code: StatusCodes.OK,
    },
    body: result,
    redirect: {
      link: process.env.CLIENT_URL,
    },
  };
};

export default getResponse;
