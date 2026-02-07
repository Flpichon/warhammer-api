export type CreateUserRepoParams = {
  email: string;
  passwordHash: string;
};

export type FindUserByEmailRepoParams = {
  email: string;
};

export type FindUserByIdRepoParams = {
  id: string;
};
