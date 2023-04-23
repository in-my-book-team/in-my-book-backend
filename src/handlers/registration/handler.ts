import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

type Params = {
  nickname: string;
  email: string;
  password: string;
};
type Result = Awaited<ReturnType<typeof UserService.registration>>;

const handler = async ({
  nickname,
  email,
  password,
}: Params): Promise<Result> => {
  try {
    if (!nickname || !email || !password) {
      throw new BadRequest({
        message: "Can't create user. Missing required fields",
      });
    }

    const user = await UserService.registration(nickname, email, password);
    console.log('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default handler;
