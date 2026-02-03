import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, Model } from 'mongoose';

import { Battle, BattleDocument } from '../schemas/battle.schema';

@Injectable()
export class BattlesRepository {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<BattleDocument>,
  ) {}

  create(params: {
    ownerId: string;
    squadId: string;
    enemy: { type: string; power: number };
    log: string[];
    result: string;
  }) {
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

  findAllByOwner(params: { ownerId: string }) {
    return this.battleModel
      .find({ ownerId: params.ownerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  findByIdAndOwner(params: { id: string; ownerId: string }) {
    return this.battleModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  removeByIdAndOwner(params: {
    id: string;
    ownerId: string;
  }): Promise<DeleteResult> {
    return this.battleModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }
}
