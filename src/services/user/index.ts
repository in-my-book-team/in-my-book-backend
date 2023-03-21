import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import MailService from '../mail';
import TokenService from '../token';
import User from '../db/entities/User';
import UserDto from '../../dtos/UserDto';
import { dbInstanse } from '../db/utils/getConnection';
import BadRequest from '../../exceptions/bad-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type Result = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};

class UserService {
  static registration = async (
    nickname: string,
    email: string,
    password: string,
  ): Promise<Result> => {
    const candidate = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (candidate) {
      throw new BadRequest({
        message: `A user with '${email}' email address already exists`,
      });
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();

    const user = await dbInstanse
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          nickname,
          email,
          password: hashPassword,
          activationLink,
        },
      ])
      .returning(['id', 'nickname', 'email', 'isActivated'])
      .execute();

    const userDto = new UserDto(user.raw[0]);

    await new MailService().sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  };

  static activate = async (activationLink: string): Promise<void> => {
    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.activationLink = :activationLink', { activationLink })
      .getOne();

    if (!user) {
      throw new BadRequest({
        message: 'Incorrect activate link',
      });
    }

    await dbInstanse
      .createQueryBuilder()
      .update(User)
      .set({
        isActivated: true,
      })
      .where('id = :id', { id: user.id })
      .execute();
  };

  static login = async (email: string, password: string): Promise<Result> => {
    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new BadRequest({
        message: `A user with '${email}' email address not found`,
      });
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw new BadRequest({
        message: 'Incorrect password',
      });
    }
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  };

  static logout = async (refreshToken: string): Promise<void> => {
    await TokenService.removeToken(refreshToken);
  };
}

export default UserService;
