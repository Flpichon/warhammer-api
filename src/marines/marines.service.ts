import { ConflictException, Injectable } from '@nestjs/common';
import { Marine } from './schemas/marine.schema';
import {
  CreateMarineParams,
  FindMarineByIdParams,
  FindMarinesParams,
  RemoveMarineParams,
  UpdateMarineParams,
} from './marines.types';
import { MarinesRepository } from './repository/marines.repository';
import type { UpdateMarinePatch } from './marines.update.types';

@Injectable()
export class MarinesService {
  constructor(private readonly marinesRepository: MarinesRepository) {}

  async create(params: CreateMarineParams): Promise<Marine> {
    try {
      return await this.marinesRepository.create({
        ownerId: params.ownerId,
        name: params.name.trim(),
        rank: params.rank.trim(),
        wargear: [],
        stats: params.stats,
        squadId: params.squadId,
      });
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Marine already used');
      }
      throw err;
    }
  }

  async findAll(params: FindMarinesParams): Promise<Marine[]> {
    return this.marinesRepository.findAllByOwner({
      ownerId: params.ownerId,
      rank: params.rank?.trim(),
      squadId: params.squadId,
    });
  }

  async findById(params: FindMarineByIdParams): Promise<Marine | null> {
    return this.marinesRepository.findByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
  }

  async update(params: UpdateMarineParams): Promise<Marine | null> {
    const update: UpdateMarinePatch = {};

    if (params.name !== undefined) {
      update.name = params.name.trim();
    }
    if (params.rank !== undefined) {
      update.rank = params.rank.trim();
    }
    if (params.squadId !== undefined) {
      update.squadId = params.squadId;
    }
    if (params.stats !== undefined) {
      update.stats = {
        hp: params.stats.hp,
        atk: params.stats.atk,
        def: params.stats.def,
      };
    }

    if (Object.keys(update).length === 0) {
      return this.findById({ ownerId: params.ownerId, id: params.id });
    }

    return this.marinesRepository.updateByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
      update,
    });
  }

  async remove(params: RemoveMarineParams): Promise<boolean> {
    const res = await this.marinesRepository.removeByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    return (res.deletedCount ?? 0) > 0;
  }
}
