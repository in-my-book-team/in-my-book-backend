import { User } from '../../src/models/user';

export const env = {
  SMTP_HOST: 'test.host',
  SMTP_PORT: 'test',
  SMTP_USER: 'test.in.my.book@outlook.com',
  SMTP_PASSWORD: 'test-password',
  API_URL: 'test-api-url',
  CLIENT_URL: 'test-client-url',
};

export const user: User = {
  id: 'test-id',
  nickname: 'TestNickname',
  email: 'test@test.com',
  isActivated: true,
};
