import { v4 as uuidv4 } from 'uuid';
import MailService from '../mail';
import TokenService from '../token';
import UserEntity from '../db/entities/User';
import { dbInstanse } from '../db/utils/getConnection';
import BadRequest from '../../exceptions/bad-request';
import { comparePasswords, hashPassword } from '../../utils/password';
import Exception from '../../exceptions';
import getUser, { User as UserType } from '../../models/user';
import type { Tokens } from '../../models/token';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type Result = {
  tokens: Tokens;
  user: UserType;
};

class User {
  static registration = async (
    nickname: string,
    email: string,
    password: string,
  ): Promise<Result> => {
    const candidate = await dbInstanse
      .getRepository(UserEntity)
      .findOne({ where: { email } });
    console.log(candidate);
    if (candidate) {
      throw new BadRequest({
        message: `A user with '${email}' email address already exists`,
      });
    }

    const hashedPassword = await hashPassword(password);
    const activationLink = uuidv4();

    const user = await dbInstanse
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          nickname,
          email,
          password: hashedPassword,
          activationLink,
        },
      ])
      .returning(['id', 'nickname', 'email', 'isActivated'])
      .execute();

    const userModel = getUser(user.raw[0]);

    await new MailService().sendActivationMail(
      email,
      `${process.env.API_URL}/activate/${activationLink}`,
    );

    const tokens = await TokenService.generate(userModel);
    await TokenService.save(userModel.id, tokens.refresh);

    return {
      tokens,
      user: userModel,
    };
  };

  static activate = async (activationLink: string): Promise<void> => {
    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where('user.activationLink = :activationLink', { activationLink })
      .getOne();
    if (!user) {
      throw new BadRequest({
        message: 'Incorrect activation link',
      });
    }

    try {
      await dbInstanse
        .createQueryBuilder()
        .update(UserEntity)
        .set({ isActivated: true })
        .where('id = :id', { id: user.id })
        .execute();
    } catch (error) {
      throw new Exception({
        message: 'Failed to activate user',
      });
    }
  };

  static login = async (email: string, password: string): Promise<Result> => {
    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new BadRequest({
        message: `A user with '${email}' email address not found`,
      });
    }

    const isPasswordsEqual = await comparePasswords(password, user.password);
    if (!isPasswordsEqual) {
      throw new BadRequest({
        message: 'Incorrect password',
      });
    }

    const userModel = getUser(user);
    const tokens = await TokenService.generate(userModel);
    await TokenService.save(userModel.id, tokens.refresh);

    return {
      tokens,
      user: userModel,
    };
  };

  static logout = async (refreshToken: string): Promise<void> => {
    try {
      await TokenService.remove(refreshToken);
    } catch (error) {
      throw new Exception({
        message: 'Failed to logout user',
      });
    }
  };
}

export default User;
