export type User = {
  id: string;
  nickname: string;
  email: string;
  isActivated: boolean;
};

const getUser = ({ id, nickname, email, isActivated }: User): User => ({
  id,
  nickname,
  email,
  isActivated,
});

export default getUser;
