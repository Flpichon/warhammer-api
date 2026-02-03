import { ConflictException, Injectable } from '@nestjs/common';
import { Battle } from './schemas/battle.schema';
import {
  CreateBattleParams,
  FindBattleByIdParams,
  FindBattlesParams,
  RemoveBattleParams,
} from './battles.types';
import { BattlesRepository } from './repository/battles.repository';

@Injectable()
export class BattlesService {
  constructor(private readonly battlesRepository: BattlesRepository) {}

  async create(params: CreateBattleParams): Promise<Battle> {
    try {
      return await this.battlesRepository.create({
        ownerId: params.ownerId,
        squadId: params.squadId,
        enemy: params.enemy,
        log: params.log,
        result: params.result,
      });
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Battle already used');
      }
      throw err;
    }
  }

  async findAll(params: FindBattlesParams): Promise<Battle[]> {
    return this.battlesRepository.findAllByOwner({ ownerId: params.ownerId });
  }

  async findById(params: FindBattleByIdParams): Promise<Battle | null> {
    return this.battlesRepository.findByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
  }

  async remove(params: RemoveBattleParams): Promise<boolean> {
    const res = await this.battlesRepository.removeByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    return (res.deletedCount ?? 0) > 0;
  }
}
