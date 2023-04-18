import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Mail from '../mail';
import Tokens from '../token';
import UserDB from '../db/entities/User';
import UserModel from '../../models/user';
import { dbInstanse } from '../db/utils/getConnection';
import BadRequest from '../../exceptions/bad-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type Result = {
  tokens: {
    access: string;
    refresh: string;
  };
  user: UserModel;
};

class User {
  static registration = async (
    nickname: string,
    email: string,
    password: string,
  ): Promise<Result> => {
    const candidate = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserDB, 'user')
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

    const userModel = new UserModel(user.raw[0]);

    await new Mail().sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const tokens = await Tokens.generate({ ...userModel });
    await Tokens.save(userModel.id, tokens.tokens.refresh);

    return {
      ...tokens,
      user: userModel,
    };
  };

  static activate = async (activationLink: string): Promise<void> => {
    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserDB, 'user')
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
      .from(UserDB, 'user')
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
    const userModel = new UserModel(user);
    const tokens = await Tokens.generate({ ...userModel });
    await Tokens.save(userModel.id, tokens.tokens.refresh);

    return {
      ...tokens,
      user: userModel,
    };
  };

  static logout = async (refreshToken: string): Promise<void> => {
    await Tokens.remove(refreshToken);
  };
}

export default User;
