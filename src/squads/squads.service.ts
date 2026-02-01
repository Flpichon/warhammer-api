import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Squad, SquadDocument } from './schemas/squad.schema';
import { CreateSquadParams } from './squads.types';

@Injectable()
export class SquadsService {
  constructor(
    @InjectModel(Squad.name)
    private readonly squadModel: Model<SquadDocument>,
  ) {}
  async create(params: CreateSquadParams, ownerId: string): Promise<Squad> {
    try {
      const created = await this.squadModel.create({
        name: params.name.trim(),
        chapter: params.chapter.trim(),
        ownerId,
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Squad already used');
      }
      throw err;
    }
  }
}
