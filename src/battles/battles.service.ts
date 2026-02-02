import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Battle } from './schemas/battle.schema';
import {
  CreateBattleParams,
  FindBattleByIdParams,
  FindBattlesParams,
  RemoveBattleParams,
} from './battles.types';

@Injectable()
export class BattlesService {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<Battle>,
  ) {}

  async create(params: CreateBattleParams): Promise<Battle> {
    try {
      const created = await this.battleModel.create({
        ownerId: params.ownerId,
        squadId: params.squadId,
        enemy: {
          type: params.enemy.type,
          power: params.enemy.power,
        },
        log: params.log,
        result: params.result,
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Battle already used');
      }
      throw err;
    }
  }

  async findAll(params: FindBattlesParams): Promise<Battle[]> {
    return this.battleModel
      .find({ ownerId: params.ownerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(params: FindBattleByIdParams): Promise<Battle | null> {
    return this.battleModel
      .findOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
  }

  async remove(params: RemoveBattleParams): Promise<boolean> {
    const res = await this.battleModel
      .deleteOne({ _id: params.id, ownerId: params.ownerId })
      .exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
