import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../db/entities/User';
import { myDataSource } from '../db/utils/getConnection';
import { MailService } from '../mail-service';
const TokenService = require('../token-service');
const ApiError = require('../../exceptions/index');
const UserDto = require('../../dtos/UserDto');

class UserService {
  async registration(nickname: string, email: string, password: string) {
    const candidate = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (candidate) {
      throw ApiError.BadRequest(
        `A user with '${email}' email address already exists`,
      );
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
  }

  async activate(activationLink: string) {
    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.activationLink = :activationLink', { activationLink })
      .getOne();

    if (!user) {
      throw ApiError.BadRequest('Incorrect activate link');
    }

    await myDataSource
      .createQueryBuilder()
      .update(User)
      .set({
        isActivated: true,
      })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async login(email: string, password: string) {
    const user = await myDataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw ApiError.BadRequest(
        `A user with '${email}' email address not found`,
      );
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }
    const userDto = new UserDto(user);
    const tokens = await TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }
}

module.exports = new UserService();
