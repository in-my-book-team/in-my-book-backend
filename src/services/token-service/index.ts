import type { DeleteResult } from 'typeorm';
import jwt from 'jsonwebtoken';
import { myDataSource } from '../db/utils/getConnection';
import Token from '../db/entities/Token';
import User from '../db/entities/User';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

type GenerateTokens = {
  accessToken: string;
  refreshToken: string;
};

class TokenService {
  static generateTokens = async (payload: any): Promise<GenerateTokens> => {
    const accessToken = jwt.sign(
      payload,
      String(process.env.JWT_ACCESS_SECRET),
      {
        expiresIn: '30m',
      },
    );
    const refreshToken = jwt.sign(
      payload,
      String(process.env.JWT_REFRESH_SECRET),
      {
        expiresIn: '30d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  static saveToken = async (
    userId: number,
    refreshToken: string,
  ): Promise<Token> => {
    const token = new Token();
    const tokenData = await myDataSource
      .createQueryBuilder()
      .select('token')
      .from(Token, 'token')
      .where('token.userId = :userId', { userId })
      .getOne();

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return myDataSource.manager.save(tokenData);
    }

    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    token.refreshToken = refreshToken;
    token.user = user!;

    await myDataSource.manager.save(token);

    return token;
  };

  static removeToken = async (refreshToken: string): Promise<DeleteResult> =>
    myDataSource
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('refreshToken = :refreshToken', { refreshToken })
      .execute();
}

export default TokenService;
