import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateUserParams,
  FindUserByEmailParams,
  FindUserByIdParams,
  UserAuth,
  UserResponse,
} from './users.types';
import { toUserAuth, toUserResponse } from './users.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createForAuth(
    params: CreateUserParams,
  ): Promise<{ auth: UserAuth; user: UserResponse }> {
    const email = params.email.trim().toLowerCase();
    try {
      const created = await this.usersRepository.create({
        email,
        passwordHash: params.passwordHash,
      });
      return { auth: toUserAuth(created), user: toUserResponse(created) };
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Email already used');
      }
      throw err;
    }
  }
  async findForAuthByEmail(
    params: FindUserByEmailParams,
  ): Promise<{ auth: UserAuth; user: UserResponse } | null> {
    const email = params.email.trim().toLowerCase();
    const doc = await this.usersRepository.findForAuthByEmail({ email });
    return doc ? { auth: toUserAuth(doc), user: toUserResponse(doc) } : null;
  }
  async findPublicById(
    params: FindUserByIdParams,
  ): Promise<UserResponse | null> {
    const doc = await this.usersRepository.findById({ id: params.id });
    return doc ? toUserResponse(doc) : null;
  }
}
