import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model } from 'mongoose';

import { Battle, BattleDocument } from '../schemas/battle.schema';
import type {
  CreateBattleRepoParams,
  FindBattleByIdAndOwnerParams,
  FindBattlesByOwnerParams,
  RemoveBattleByIdAndOwnerParams,
} from './battles.repository.types';

@Injectable()
export class BattlesRepository {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>,
  ) {}

  create(params: CreateBattleRepoParams) {
    return this.battleModel.create({
      ownerId: params.ownerId,
      squadId: params.squadId,
      enemy: {
        type: params.enemy.type,
        power: params.enemy.power,
      },
      log: params.log,
      result: params.result,
    });
  }

  findAllByOwner(params: FindBattlesByOwnerParams) {
    return this.battleModel
      .find({ ownerId: params.ownerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  findByIdAndOwner(params: FindBattleByIdAndOwnerParams) {
    return this.battleModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  removeByIdAndOwner(
    params: RemoveBattleByIdAndOwnerParams,
  ): Promise<DeleteResult> {
    return this.battleModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }
}
