export type CreateUserParams = {
  email: string;
  passwordHash: string;
};

export type FindUserByEmailParams = {
  email: string;
};

export type FindUserByIdParams = {
  id: string;
};
