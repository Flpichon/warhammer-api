import { Rank, Weapon } from './marines.enums';

export type MarineStats = {
  hp: number;
  atk: number;
  def: number;
};

export type CreateMarineParams = {
  ownerId: string;
  name: string;
  rank: Rank;
  stats: MarineStats;
  chapter: string;
  squadId?: string;
  wargear?: Weapon[];
};

export type FindMarineByIdParams = {
  ownerId: string;
  id: string;
};

export type FindMarinesParams = {
  ownerId: string;
  chapter?: string;
  rank?: Rank;
  squadId?: string;
  page?: number;
  limit?: number;
};

export type FindMarineChaptersParams = {
  ownerId: string;
  q?: string;
  limit?: number;
};

export type UpdateMarineParams = {
  ownerId: string;
  id: string;
  name?: string;
  rank?: Rank;
  stats?: MarineStats;
  squadId?: string;
  chapter?: string;
  wargear?: Weapon[];
};

export type RemoveMarineParams = {
  ownerId: string;
  id: string;
};
