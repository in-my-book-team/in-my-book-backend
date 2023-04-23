import type {
  HandlerEvent,
  HandlerResponse,
} from '../../server/request-handler';
import { StatusCodes } from '../../constants/status-codes';
import BadRequest from '../../exceptions/bad-request';
import handler from './handler';
import { getHasErrors } from '../../utils/validation';
import { validate } from './validate';

type RequestBody = {
  email: string;
  password: string;
};
type LoginResult = Awaited<ReturnType<typeof handler>>;
type ResponseBody = LoginResult;
type ResponseCookie = {
  refreshToken: LoginResult['tokens']['refresh'];
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

  const { email, password } = request.body;
  const result = await handler({ email, password });

  return {
    status: {
      code: StatusCodes.OK,
    },
    body: result,
    cookie: {
      refreshToken: result.tokens.refresh,
    },
  };
};

export default getResponse;
