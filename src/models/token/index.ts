export type Tokens = {
  access: string;
  refresh: string;
};

const getTokens = ({ access, refresh }: Tokens): Tokens => ({
  access,
  refresh,
});

export default getTokens;
