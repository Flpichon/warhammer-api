import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Battle } from './schemas/battle.schema';

@Injectable()
export class BattlesService {
  constructor(
    @InjectModel(Battle.name)
    private readonly battleModel: Model<Battle>,
  ) {}

  async create(params: {
    ownerId: string;
    squadId: string;
    enemy: { type: string; power: number };
    log: string[];
    result: string;
  }): Promise<Battle> {
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
}
