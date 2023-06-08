import BadRequest from '../../exceptions/bad-request';
import UserService from '../../services/user';

type Params = {
  email: string;
  password: string;
};
type Body = Awaited<ReturnType<typeof UserService.login>>;

const handler = async ({ email, password }: Params): Promise<Body> => {
  try {
    if (!email || !password) {
      throw new BadRequest({
        message: "Can't login without email or password",
      });
    }

    const user = await UserService.login(email, password);

    return user;
  } catch (error) {
    throw new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default handler;
