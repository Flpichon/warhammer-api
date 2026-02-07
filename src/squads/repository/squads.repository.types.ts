export type CreateSquadRepoParams = {
  ownerId: string;
  name: string;
};

export type FindSquadsByOwnerParams = {
  ownerId: string;
};

export type FindSquadByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type ExistsSquadByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type UpdateSquadPatch = {
  name?: string;
};

export type UpdateSquadByIdAndOwnerParams = {
  id: string;
  ownerId: string;
  update: UpdateSquadPatch;
};

export type RemoveSquadByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type AddMarineToSquadParams = {
  ownerId: string;
  squadId: string;
  marineId: string;
};
