import type { DeleteResult } from 'typeorm';
import jwt from 'jsonwebtoken';
import { dbInstanse } from '../db/utils/getConnection';
import TokenDB from '../db/entities/Token';
import UserDB from '../db/entities/User';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type TokensType = {
  tokens: {
    access: string;
    refresh: string;
  };
};

class Tokens {
  static generate = async (payload: any): Promise<TokensType> => {
    const access = jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET), {
      expiresIn: '30m',
    });
    const refresh = jwt.sign(payload, String(process.env.JWT_REFRESH_SECRET), {
      expiresIn: '30d',
    });

    return {
      tokens: {
        access,
        refresh,
      },
    };
  };

  static save = async (
    userId: number,
    refreshToken: string,
  ): Promise<TokenDB> => {
    const token = new TokenDB();
    const tokenData = await dbInstanse
      .createQueryBuilder()
      .select('token')
      .from(TokenDB, 'token')
      .where('token.userId = :userId', { userId })
      .getOne();

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return dbInstanse.manager.save(tokenData);
    }

    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserDB, 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    token.refreshToken = refreshToken;
    if (user) token.user = user;

    await dbInstanse.manager.save(token);

    return token;
  };

  static remove = async (refreshToken: string): Promise<DeleteResult> =>
    dbInstanse
      .createQueryBuilder()
      .delete()
      .from(TokenDB)
      .where('refreshToken = :refreshToken', { refreshToken })
      .execute();
}

export default Tokens;
