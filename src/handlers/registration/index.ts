import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import handler from './handler';
import BadRequest from '../../exceptions/bad-request';
import { validate } from './validate';
import { getHasErrors } from '../../utils/validation';

type RequestBody = {
  nickname: string;
  email: string;
  password: string;
};
type ResponseBody = Awaited<ReturnType<typeof handler>>;
type ResponseCookie = {
  refreshToken: string;
};

const getResponse = async (
  request: HandlerEvent<RequestBody, any, any, any>,
): Promise<HandlerResponse<ResponseBody, ResponseCookie>> => {
  const validationResults = await validate.run(request);
  const hasErrors = getHasErrors(validationResults);
  if (hasErrors) {
    throw new BadRequest({
      message: JSON.stringify(
        validationResults.map((result) => result.array()),
      ),
    });
  }

  const { nickname, email, password } = request.body;
  const user = await handler({ nickname, email, password });

  return {
    status: {
      code: StatusCodes.OK,
    },
    body: user,
    cookie: {
      refreshToken: user.tokens.refresh,
    },
  };
};

export default getResponse;
