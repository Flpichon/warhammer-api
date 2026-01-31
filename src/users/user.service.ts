import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(params: { email: string; passwordHash: string }): Promise<User> {
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
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
