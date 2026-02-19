import { Rank, Weapon } from '../marines.enums';

export type CreateMarineRepoParams = {
  ownerId: string;
  name: string;
  rank: Rank;
  wargear: Weapon[];
  chapter: string;
  stats: { hp: number; atk: number; def: number };
  squadId?: string;
};

export type FindMarinesByOwnerParams = {
  ownerId: string;
  rank?: Rank;
  squadId?: string;
  chapter?: string;
  page: number;
  limit: number;
};

export type FindDistinctChaptersParams = {
  ownerId: string;
  q?: string;
  limit: number;
};

export type FindMarineByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type FindMarineSquadIdParams = {
  id: string;
  ownerId: string;
};

export type UpdateMarinePatch = {
  name?: string;
  rank?: Rank;
  squadId?: string;
  chapter?: string;
  stats?: {
    hp: number;
    atk: number;
    def: number;
  };
  wargear?: Weapon[];
};

export type UpdateMarineByIdAndOwnerParams = {
  id: string;
  ownerId: string;
  update: UpdateMarinePatch;
};

export type RemoveMarineByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type AssignMarineToSquadParams = {
  ownerId: string;
  marineId: string;
  squadId: string;
};

export type UnsetMarineSquadParams = {
  ownerId: string;
  marineId: string;
  squadId: string;
};
