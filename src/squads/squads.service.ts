import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Squad, SquadDocument } from './schemas/squad.schema';
import {
  CreateSquadParams,
  FindSquadByIdParams,
  FindSquadsParams,
  RemoveSquadParams,
  UpdateSquadParams,
} from './squads.types';

@Injectable()
export class SquadsService {
  constructor(
    @InjectModel(Squad.name)
    private readonly squadModel: Model<SquadDocument>,
  ) {}
  async create(params: CreateSquadParams): Promise<Squad> {
    try {
      const created = await this.squadModel.create({
        name: params.name.trim(),
        chapter: params.chapter.trim(),
        ownerId: params.ownerId,
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

  async findAll(params: FindSquadsParams): Promise<Squad[]> {
    return this.squadModel.find({ ownerId: params.ownerId }).exec();
  }

  async findById(params: FindSquadByIdParams): Promise<Squad | null> {
    return this.squadModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  async update(params: UpdateSquadParams): Promise<Squad | null> {
    const update: Record<string, unknown> = {};

    if (params.name !== undefined) {
      update.name = params.name.trim();
    }
    if (params.chapter !== undefined) {
      update.chapter = params.chapter.trim();
    }

    if (Object.keys(update).length === 0) {
      return this.findById({ ownerId: params.ownerId, id: params.id });
    }

    return this.squadModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        { $set: update },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }

  async remove(params: RemoveSquadParams): Promise<boolean> {
    const res = await this.squadModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
