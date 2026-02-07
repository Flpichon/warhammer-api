import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import type {
  CreateUserRepoParams,
  FindUserByEmailRepoParams,
  FindUserByIdRepoParams,
} from './users.repository.types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(params: CreateUserRepoParams) {
    return this.userModel.create({
      email: params.email,
      passwordHash: params.passwordHash,
    });
  }

  findForAuthByEmail(params: FindUserByEmailRepoParams) {
    return this.userModel
      .findOne({ email: params.email })
      .select('+passwordHash')
      .exec();
  }

  findById(params: FindUserByIdRepoParams) {
    return this.userModel.findById(params.id).exec();
  }
}
