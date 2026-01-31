import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Marine, MarineDocument } from './schemas/marine.schema';
import { TCreateMarineParams } from './marines.types';

@Injectable()
export class MarinesService {
  constructor(
    @InjectModel(Marine.name)
    private readonly marineModel: Model<MarineDocument>,
  ) {}

  async create(params: TCreateMarineParams, squadId: string): Promise<Marine> {
    try {
      const created = await this.marineModel.create({
        name: params.name.trim(),
        rank: params.rank.trim(),
        wargear: [],
        stats: {
          hp: params.stats.hp,
          atk: params.stats.atk,
          def: params.stats.def,
        },
        squadId,
        ownerId: params.ownerId,
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Marine already used');
      }
      throw err;
    }
  }
}
