export type CreateMarineRepoParams = {
  ownerId: string;
  name: string;
  rank: string;
  wargear: string[];
  chapter: string;
  stats: { hp: number; atk: number; def: number };
  squadId?: string;
};

export type FindMarinesByOwnerParams = {
  ownerId: string;
  rank?: string;
  squadId?: string;
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
  rank?: string;
  squadId?: string;
  chapter?: string;
  stats?: {
    hp: number;
    atk: number;
    def: number;
  };
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
