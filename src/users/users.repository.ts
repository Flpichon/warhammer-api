import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(params: { email: string; passwordHash: string }) {
    return this.userModel.create({
      email: params.email,
      passwordHash: params.passwordHash,
    });
  }

  findForAuthByEmail(params: { email: string }) {
    return this.userModel
      .findOne({ email: params.email })
      .select('+passwordHash')
      .exec();
  }

  findById(params: { id: string }) {
    return this.userModel.findById(params.id).exec();
  }
}
