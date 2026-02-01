export type MarineStats = {
  hp: number;
  atk: number;
  def: number;
};

export type CreateMarineParams = {
  ownerId: string;
  name: string;
  rank: string;
  stats: MarineStats;
  squadId?: string;
};

export type FindMarineByIdParams = {
  ownerId: string;
  id: string;
};

export type FindMarinesParams = {
  ownerId: string;
  rank?: string;
  squadId?: string;
};

export type UpdateMarineParams = {
  ownerId: string;
  id: string;
  name?: string;
  rank?: string;
  stats?: MarineStats;
  squadId?: string;
};

export type RemoveMarineParams = {
  ownerId: string;
  id: string;
};
