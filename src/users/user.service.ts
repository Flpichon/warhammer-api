import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  CreateUserParams,
  FindUserByEmailParams,
  FindUserByIdParams,
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
  async createAuth(params: CreateUserParams): Promise<UserAuth> {
    const email = params.email.trim().toLowerCase();
    try {
      const created = await this.userModel.create({
        email,
        passwordHash: params.passwordHash,
      });
      return toUserAuth(created);
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Email already used');
      }
      throw err;
    }
  }
  async findAuthByEmail(
    params: FindUserByEmailParams,
  ): Promise<UserAuth | null> {
    const email = params.email.trim().toLowerCase();
    const doc = await this.userModel
      .findOne({ email })
      .select('+passwordHash')
      .exec();
    return doc ? toUserAuth(doc) : null;
  }
  async findPublicById(
    params: FindUserByIdParams,
  ): Promise<UserResponse | null> {
    const doc = await this.userModel.findById(params.id).exec();
    return doc ? toUserResponse(doc) : null;
  }
}
