import { User } from '../db/entities/User';
import { Token } from '../db/entities/Token';
import { myDataSource } from '../db/utils/getConnection';

const jwt = require('jsonwebtoken');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class TokenService {
  async generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = new Token();
    const tokenData = await myDataSource
      .createQueryBuilder()
      .select('token')
      .from(Token, 'token')
      .where('token.userId = :userId', { userId: userId })
      .getOne();

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await myDataSource.manager.save(tokenData);
    }

    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :userId', { userId: userId })
      .getOne();

    token.refreshToken = refreshToken;
    token.user = user!;

    await myDataSource.manager.save(token);

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await myDataSource
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where('refreshToken = :refreshToken', { refreshToken })
      .execute();
    return tokenData;
  }
}

module.exports = new TokenService();
