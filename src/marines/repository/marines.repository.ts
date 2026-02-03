import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model, UpdateResult } from 'mongoose';

import { Marine, MarineDocument } from '../schemas/marine.schema';
import type { UpdateMarinePatch } from '../marines.update.types';

@Injectable()
export class MarinesRepository {
  constructor(
    @InjectModel(Marine.name)
    private readonly marineModel: Model<MarineDocument>,
  ) {}

  create(params: {
    ownerId: string;
    name: string;
    rank: string;
    wargear: string[];
    stats: { hp: number; atk: number; def: number };
    squadId?: string;
  }) {
    return this.marineModel.create({
      ownerId: params.ownerId,
      name: params.name,
      rank: params.rank,
      wargear: params.wargear,
      stats: {
        hp: params.stats.hp,
        atk: params.stats.atk,
        def: params.stats.def,
      },
      squadId: params.squadId,
    });
  }

  findAllByOwner(params: { ownerId: string; rank?: string; squadId?: string }) {
    const filter: Record<string, unknown> = { ownerId: params.ownerId };
    if (params.rank) {
      filter.rank = params.rank;
    }
    if (params.squadId) {
      filter.squadId = params.squadId;
    }

    return this.marineModel.find(filter).exec();
  }

  updateByIdAndOwner(params: {
    id: string;
    ownerId: string;
    update: UpdateMarinePatch;
  }) {
    return this.marineModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        { $set: params.update },
        { new: true, runValidators: true },
      )
      .exec();
  }

  removeByIdAndOwner(params: {
    id: string;
    ownerId: string;
  }): Promise<DeleteResult> {
    return this.marineModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  assignToSquadIfUnassignedOrSameSquad(params: {
    ownerId: string;
    marineId: string;
    squadId: string;
  }): Promise<UpdateResult> {
    return this.marineModel.updateOne(
      {
        _id: params.marineId,
        ownerId: params.ownerId,
        $or: [
          { squadId: { $exists: false } },
          { squadId: null },
          { squadId: params.squadId },
        ],
      },
      { $set: { squadId: params.squadId } },
      { runValidators: true },
    );
  }

  findSquadIdByIdAndOwner(params: { id: string; ownerId: string }) {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .select('squadId')
      .exec();
  }

  findByIdAndOwner(params: { id: string; ownerId: string }) {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  unsetSquadId(params: { ownerId: string; marineId: string; squadId: string }) {
    return this.marineModel.updateOne(
      {
        _id: params.marineId,
        ownerId: params.ownerId,
        squadId: params.squadId,
      },
      { $unset: { squadId: 1 } },
    );
  }
}
