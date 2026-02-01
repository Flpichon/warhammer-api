import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marine, MarineDocument } from './schemas/marine.schema';
import {
  CreateMarineParams,
  FindMarineByIdParams,
  FindMarinesParams,
  RemoveMarineParams,
  UpdateMarineParams,
} from './marines.types';

@Injectable()
export class MarinesService {
  constructor(
    @InjectModel(Marine.name)
    private readonly marineModel: Model<MarineDocument>,
  ) {}

  async create(params: CreateMarineParams): Promise<Marine> {
    try {
      // ça peut être interessant de créer un repository pour encapsuler ce genre de logique (MEMO @FLP) ?
      // mais pour l'instant on va faire simple
      const created = await this.marineModel.create({
        name: params.name.trim(),
        rank: params.rank.trim(),
        wargear: [],
        stats: {
          hp: params.stats.hp,
          atk: params.stats.atk,
          def: params.stats.def,
        },
        squadId: params.squadId,
        ownerId: params.ownerId,
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Marine already used');
      }
      throw err;
    }
  }

  async findAll(params: FindMarinesParams): Promise<Marine[]> {
    const filter: Record<string, unknown> = {
      ownerId: params.ownerId,
    };

    if (params.rank) {
      filter.rank = params.rank.trim();
    }
    if (params.squadId) {
      filter.squadId = params.squadId;
    }

    return this.marineModel.find(filter).exec();
  }

  async findById(params: FindMarineByIdParams): Promise<Marine | null> {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  async update(params: UpdateMarineParams): Promise<Marine | null> {
    const update: Record<string, unknown> = {};

    if (params.name !== undefined) {
      update.name = params.name.trim();
    }
    if (params.rank !== undefined) {
      update.rank = params.rank.trim();
    }
    if (params.squadId !== undefined) {
      update.squadId = params.squadId;
    }
    if (params.stats !== undefined) {
      update.stats = {
        hp: params.stats.hp,
        atk: params.stats.atk,
        def: params.stats.def,
      };
    }

    if (Object.keys(update).length === 0) {
      return this.findById({ ownerId: params.ownerId, id: params.id });
    }

    return this.marineModel
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

  async remove(params: RemoveMarineParams): Promise<boolean> {
    const res = await this.marineModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
