import type { HandlerResponse } from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import handler from './handler';

const getResponse = async (): Promise<HandlerResponse> => {
  const result = await handler();

  return {
    status: {
      code: StatusCodes.OK,
    },
    body: result,
  };
};

export default getResponse;
