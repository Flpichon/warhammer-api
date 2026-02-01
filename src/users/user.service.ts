import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  CreateUserParams,
  FindUserByEmailParams,
  FindUserByIdParams,
} from './users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(params: CreateUserParams): Promise<User> {
    const email = params.email.trim().toLowerCase();
    try {
      const created = await this.userModel.create({
        email,
        passwordHash: params.passwordHash,
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Email already used');
      }
      throw err;
    }
  }
  async findByEmail(params: FindUserByEmailParams): Promise<User | null> {
    return this.userModel
      .findOne({ email: params.email.trim().toLowerCase() })
      .exec();
  }
  async findById(params: FindUserByIdParams): Promise<User | null> {
    return this.userModel.findById(params.id).exec();
  }
}
