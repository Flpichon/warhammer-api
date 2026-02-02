import { UserResponse } from 'src/users/users.types';

export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  user: UserResponse;
};
