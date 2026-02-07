import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model } from 'mongoose';

import { Squad, SquadDocument } from '../schemas/squad.schema';
import type {
  AddMarineToSquadParams,
  CreateSquadRepoParams,
  ExistsSquadByIdAndOwnerParams,
  FindSquadByIdAndOwnerParams,
  FindSquadsByOwnerParams,
  RemoveSquadByIdAndOwnerParams,
  UpdateSquadByIdAndOwnerParams,
} from './squads.repository.types';

@Injectable()
export class SquadsRepository {
  constructor(
    @InjectModel(Squad.name)
    private readonly squadModel: Model<SquadDocument>,
  ) {}

  create(params: CreateSquadRepoParams) {
    return this.squadModel.create({
      ownerId: params.ownerId,
      name: params.name,
    });
  }

  findAllByOwner(params: FindSquadsByOwnerParams) {
    return this.squadModel.find({ ownerId: params.ownerId }).exec();
  }

  existsByIdAndOwner(params: ExistsSquadByIdAndOwnerParams) {
    return this.squadModel.exists({ _id: params.id, ownerId: params.ownerId });
  }

  addMarineId(params: AddMarineToSquadParams) {
    return this.squadModel.updateOne(
      { _id: params.squadId, ownerId: params.ownerId },
      { $addToSet: { marineIds: params.marineId } },
      { runValidators: true },
    );
  }

  findByIdAndOwner(params: FindSquadByIdAndOwnerParams) {
    return this.squadModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  updateByIdAndOwner(params: UpdateSquadByIdAndOwnerParams) {
    return this.squadModel
      .findOneAndUpdate(
        { _id: params.id, ownerId: params.ownerId },
        { $set: params.update },
        { new: true, runValidators: true },
      )
      .exec();
  }

  removeByIdAndOwner(
    params: RemoveSquadByIdAndOwnerParams,
  ): Promise<DeleteResult> {
    return this.squadModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }
}
