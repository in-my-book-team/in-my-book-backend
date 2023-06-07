import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../constants';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return hashedPassword;
};

export const comparePasswords = async (
  password1: string,
  password2: string,
): Promise<boolean> => {
  const isEqual = await bcrypt.compare(password1, password2);

  return isEqual;
};
