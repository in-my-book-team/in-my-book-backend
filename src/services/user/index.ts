import type { DeleteResult } from 'typeorm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Exceptions from '../../exceptions';
import MailService from '../mail-service';
import TokenService from '../token-service';
import User from '../db/entities/User';
import UserDto from '../../dtos/UserDto';
import { myDataSource } from '../db/utils/getConnection';
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
    const candidate = await myDataSource
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

    const user = await myDataSource
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
    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.activationLink = :activationLink', { activationLink })
      .getOne();

    if (!user) {
      throw Exceptions.BadRequest('Incorrect activate link');
    }

    await myDataSource
      .createQueryBuilder()
      .update(User)
      .set({
        isActivated: true,
      })
      .where('id = :id', { id: user.id })
      .execute();
  };

  static login = async (email: string, password: string): Promise<Result> => {
    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw Exceptions.BadRequest(
        `A user with '${email}' email address not found`,
      );
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw Exceptions.BadRequest('Incorrect password');
    }
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  };

  static logout = async (refreshToken: string): Promise<DeleteResult> => {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  };
}

export default UserService;
