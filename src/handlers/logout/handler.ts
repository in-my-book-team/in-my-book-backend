import UserService from '../../services/user';
import BadRequest from '../../exceptions/bad-request';

const handler = async (refreshToken: string): Promise<void> => {
  try {
    if (!refreshToken) {
      throw new BadRequest({
        message: 'User is already logged out',
      });
    }

    await UserService.logout(refreshToken);
  } catch (error) {
    throw new BadRequest({
      message: error instanceof Error ? error?.message : undefined,
    });
  }
};

export default handler;
