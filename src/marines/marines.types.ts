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
  chapterId?: string | null;
  squadId?: string;
  wargear?: Weapon[];
};

export type FindMarineByIdParams = {
  ownerId: string;
  id: string;
};

export type FindMarinesParams = {
  ownerId: string;
  chapterId?: string;
  rank?: Rank;
  squadId?: string;
  page?: number;
  limit?: number;
};

export type UpdateMarineParams = {
  ownerId: string;
  id: string;
  name?: string;
  rank?: Rank;
  stats?: MarineStats;
  squadId?: string;
  chapterId?: string | null;
  wargear?: Weapon[];
};

export type RemoveMarineParams = {
  ownerId: string;
  id: string;
};
