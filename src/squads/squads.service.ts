import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Squad } from './schemas/squad.schema';
import { Marine } from '../marines/schemas/marine.schema';
import { MarinesRepository } from '../marines/repository/marines.repository';
import { SquadsRepository } from './repository/squads.repository';
import {
  AssignMarineParams,
  CreateSquadParams,
  FindSquadByIdParams,
  FindSquadsParams,
  RemoveSquadParams,
  UpdateSquadParams,
} from './squads.types';
import type { UpdateSquadPatch } from './repository/squads.repository.types';

@Injectable()
export class SquadsService {
  constructor(
    private readonly squadsRepository: SquadsRepository,
    private readonly marinesRepository: MarinesRepository,
  ) {}
  async create(params: CreateSquadParams): Promise<Squad> {
    try {
      const created = await this.squadsRepository.create({
        ownerId: params.ownerId,
        name: params.name.trim(),
        chapter: params.chapter.trim(),
      });
      return created;
    } catch (err: any) {
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        throw new ConflictException('Squad already used');
      }
      throw err;
    }
  }

  async findAll(params: FindSquadsParams): Promise<Squad[]> {
    return this.squadsRepository.findAllByOwner({ ownerId: params.ownerId });
  }

  async findById(params: FindSquadByIdParams): Promise<Squad | null> {
    return this.squadsRepository.findByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
  }

  async update(params: UpdateSquadParams): Promise<Squad | null> {
    const update: UpdateSquadPatch = {};

    if (params.name !== undefined) {
      update.name = params.name.trim();
    }
    if (params.chapter !== undefined) {
      update.chapter = params.chapter.trim();
    }

    if (Object.keys(update).length === 0) {
      return this.findById({ ownerId: params.ownerId, id: params.id });
    }

    return this.squadsRepository.updateByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
      update,
    });
  }

  async remove(params: RemoveSquadParams): Promise<boolean> {
    const res = await this.squadsRepository.removeByIdAndOwner({
      id: params.id,
      ownerId: params.ownerId,
    });
    return (res.deletedCount ?? 0) > 0;
  }

  async assignMarine(
    params: AssignMarineParams,
  ): Promise<{ squad: Squad; marine: Marine }> {
    const squadExists = await this.squadsRepository.existsByIdAndOwner({
      id: params.squadId,
      ownerId: params.ownerId,
    });

    if (!squadExists) {
      throw new NotFoundException('Squad not found');
    }

    const marineRes =
      await this.marinesRepository.assignToSquadIfUnassignedOrSameSquad({
        ownerId: params.ownerId,
        marineId: params.marineId,
        squadId: params.squadId,
      });

    if ((marineRes.matchedCount ?? 0) === 0) {
      const existing = await this.marinesRepository.findSquadIdByIdAndOwner({
        id: params.marineId,
        ownerId: params.ownerId,
      });

      if (!existing) {
        throw new NotFoundException('Marine not found');
      }

      throw new ConflictException('Marine already assigned to another squad');
    }

    const squadRes = await this.squadsRepository.addMarineId(params);

    if ((squadRes.matchedCount ?? 0) === 0) {
      if ((marineRes.modifiedCount ?? 0) > 0) {
        await this.marinesRepository.unsetSquadId({
          ownerId: params.ownerId,
          marineId: params.marineId,
          squadId: params.squadId,
        });
      }

      throw new NotFoundException('Squad not found');
    }

    const [squad, marine] = await Promise.all([
      this.squadsRepository.findByIdAndOwner({
        id: params.squadId,
        ownerId: params.ownerId,
      }),
      this.marinesRepository.findByIdAndOwner({
        id: params.marineId,
        ownerId: params.ownerId,
      }),
    ]);

    if (!squad) {
      throw new NotFoundException('Squad not found');
    }
    if (!marine) {
      throw new NotFoundException('Marine not found');
    }

    return { squad, marine };
  }
}
