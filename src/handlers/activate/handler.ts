import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

type Body = {
  message: string;
};

const handler = async (link: string): Promise<Body> => {
  try {
    if (!link) {
      throw new BadRequest({
        message: "Can't activate user without activation link",
      });
    }

    await UserService.activate(link);

    return { message: 'User activated' };
  } catch (error) {
    throw new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default handler;
