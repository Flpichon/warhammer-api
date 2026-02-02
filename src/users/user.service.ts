import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  CreateUserParams,
  FindUserByEmailParams,
  UserAuth,
  UserResponse,
} from './users.types';
import { toUserAuth, toUserResponse } from './users.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createForAuth(
    params: CreateUserParams,
  ): Promise<{ auth: UserAuth; user: UserResponse }> {
    const email = params.email.trim().toLowerCase();
    try {
      const created = await this.userModel.create({
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
    const doc = await this.userModel
      .findOne({ email })
      .select('+passwordHash')
      .exec();
    return doc ? { auth: toUserAuth(doc), user: toUserResponse(doc) } : null;
  }
}
