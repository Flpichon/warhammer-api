import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model } from 'mongoose';

import type { AssignMarineParams } from '../squads.types';
import { Squad, SquadDocument } from '../schemas/squad.schema';
import type { UpdateSquadPatch } from './squads.repository.types';

@Injectable()
export class SquadsRepository {
  constructor(
    @InjectModel(Squad.name)
    private readonly squadModel: Model<SquadDocument>,
  ) {}

  create(params: { ownerId: string; name: string; chapter: string }) {
    return this.squadModel.create({
      ownerId: params.ownerId,
      name: params.name,
      chapter: params.chapter,
    });
  }

  findAllByOwner(params: { ownerId: string }) {
    return this.squadModel.find({ ownerId: params.ownerId }).exec();
  }

  existsByIdAndOwner(params: { id: string; ownerId: string }) {
    return this.squadModel.exists({ _id: params.id, ownerId: params.ownerId });
  }

  addMarineId(params: AssignMarineParams) {
    return this.squadModel.updateOne(
      { _id: params.squadId, ownerId: params.ownerId },
      { $addToSet: { marineIds: params.marineId } },
      { runValidators: true },
    );
  }

  findByIdAndOwner(params: { id: string; ownerId: string }) {
    return this.squadModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  updateByIdAndOwner(params: {
    id: string;
    ownerId: string;
    update: UpdateSquadPatch;
  }) {
    return this.squadModel
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
    return this.squadModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }
}
