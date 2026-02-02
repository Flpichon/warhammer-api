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

export type UserAuth = {
  id: string;
  email: string;
  passwordHash: string;
};

export type UserResponse = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
