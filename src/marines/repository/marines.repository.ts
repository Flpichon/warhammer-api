import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model, UpdateResult } from 'mongoose';

import { Marine, MarineDocument } from '../schemas/marine.schema';
import type {
  AssignMarineToSquadParams,
  CreateMarineRepoParams,
  FindMarineByIdAndOwnerParams,
  FindMarineSquadIdParams,
  FindMarinesByOwnerParams,
  RemoveMarineByIdAndOwnerParams,
  UnsetMarineSquadParams,
  UpdateMarineByIdAndOwnerParams,
} from './marines.repository.types';

@Injectable()
export class MarinesRepository {
  constructor(
    @InjectModel(Marine.name)
    private readonly marineModel: Model<MarineDocument>,
  ) {}

  create(params: CreateMarineRepoParams) {
    return this.marineModel.create({
      ownerId: params.ownerId,
      name: params.name,
      rank: params.rank,
      wargear: params.wargear,
      chapter: params.chapter,
      stats: {
        hp: params.stats.hp,
        atk: params.stats.atk,
        def: params.stats.def,
      },
      squadId: params.squadId,
    });
  }

  findAllByOwner(params: FindMarinesByOwnerParams) {
    const filter: Record<string, unknown> = { ownerId: params.ownerId };
    if (params.rank) {
      filter.rank = params.rank;
    }
    if (params.squadId) {
      filter.squadId = params.squadId;
    }

    return this.marineModel.find(filter).exec();
  }

  updateByIdAndOwner(params: UpdateMarineByIdAndOwnerParams) {
    return this.marineModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        { $set: params.update },
        { new: true, runValidators: true },
      )
      .exec();
  }

  removeByIdAndOwner(
    params: RemoveMarineByIdAndOwnerParams,
  ): Promise<DeleteResult> {
    return this.marineModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  assignToSquadIfUnassignedOrSameSquad(
    params: AssignMarineToSquadParams,
  ): Promise<UpdateResult> {
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

  findSquadIdByIdAndOwner(params: FindMarineSquadIdParams) {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .select('squadId')
      .exec();
  }

  findByIdAndOwner(params: FindMarineByIdAndOwnerParams) {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  unsetSquadId(params: UnsetMarineSquadParams) {
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
