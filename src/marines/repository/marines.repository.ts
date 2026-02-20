import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type DeleteResult, type Model, type UpdateResult } from 'mongoose';

import { toObjectId } from '../../common/mongoose/objectid.utils';
import { Marine, MarineDocument } from '../schemas/marine.schema';
import type {
  AssignMarineToSquadParams,
  CountMarinesByChapterIdParams,
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

  create(params: CreateMarineRepoParams): Promise<Marine> {
    return this.marineModel.create({
      ownerId: params.ownerId,
      name: params.name,
      rank: params.rank,
      wargear: params.wargear,
      chapterId: params.chapterId ?? null,
      stats: {
        hp: params.stats.hp,
        atk: params.stats.atk,
        def: params.stats.def,
      },
      squadId: params.squadId,
    });
  }

  findAllByOwner(params: FindMarinesByOwnerParams): Promise<{
    items: Marine[];
    page: number;
    limit: number;
    total: number;
  }> {
    const filter: Record<string, unknown> = { ownerId: params.ownerId };
    if (params.rank) {
      filter.rank = params.rank;
    }
    if (params.squadId) {
      filter.squadId = params.squadId;
    }
    if (params.chapterId) {
      filter.chapterId = toObjectId(params.chapterId);
    }
    const skip = (params.page - 1) * params.limit;
    const itemsQuery = this.marineModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(params.limit)
      .exec();

    const totalQuery = this.marineModel.countDocuments(filter).exec();
    return Promise.all([itemsQuery, totalQuery]).then(([items, total]) => ({
      items,
      page: params.page,
      limit: params.limit,
      total,
    }));
  }

  updateByIdAndOwner(
    params: UpdateMarineByIdAndOwnerParams,
  ): Promise<Marine | null> {
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

  findSquadIdByIdAndOwner(
    params: FindMarineSquadIdParams,
  ): Promise<Marine | null> {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .select('squadId')
      .exec();
  }

  findByIdAndOwner(
    params: FindMarineByIdAndOwnerParams,
  ): Promise<Marine | null> {
    return this.marineModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  unsetSquadId(params: UnsetMarineSquadParams): Promise<UpdateResult> {
    return this.marineModel.updateOne(
      {
        _id: params.marineId,
        ownerId: params.ownerId,
        squadId: params.squadId,
      },
      { $unset: { squadId: 1 } },
    );
  }

  countByChapterId(params: CountMarinesByChapterIdParams): Promise<number> {
    return this.marineModel
      .countDocuments({
        chapterId: toObjectId(params.chapterId),
        ownerId: toObjectId(params.ownerId),
      })
      .exec();
  }
}
