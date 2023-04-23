import type { DeleteResult } from 'typeorm';
import jwt from 'jsonwebtoken';
import { dbInstanse } from '../db/utils/getConnection';
import TokenEntity from '../db/entities/Token';
import UserEntity from '../db/entities/User';
import Exception from '../../exceptions';
import type { Tokens } from '../../models/token';
import getTokens from '../../models/token';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class Token {
  static generate = async (payload: any): Promise<Tokens> => {
    const access = jwt.sign(payload, String(process.env.JWT_ACCESS_SECRET), {
      expiresIn: '30m',
    });
    const refresh = jwt.sign(payload, String(process.env.JWT_REFRESH_SECRET), {
      expiresIn: '30d',
    });

    return getTokens({ access, refresh });
  };

  static save = async (userId: string, refreshToken: string): Promise<void> => {
    const tokenData = await dbInstanse
      .createQueryBuilder()
      .select('token')
      .from(TokenEntity, 'token')
      .where('token.userId = :userId', { userId })
      .getOne();

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await dbInstanse.manager.save(tokenData);
    }

    const user = await dbInstanse
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    try {
      await dbInstanse.manager.save({ user, refreshToken });
    } catch (error) {
      throw new Exception({
        message: 'Failed to save token in DB',
      });
    }
  };

  static remove = async (refreshToken: string): Promise<DeleteResult> =>
    dbInstanse
      .createQueryBuilder()
      .delete()
      .from(TokenEntity)
      .where('refreshToken = :refreshToken', { refreshToken })
      .execute();
}

export default Token;
