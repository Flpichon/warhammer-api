export type CreateSquadParams = {
  name: string;
  chapter: string;
  ownerId: string;
};

export type FindSquadByIdParams = {
  ownerId: string;
  id: string;
};

export type FindSquadsParams = {
  ownerId: string;
};

export type UpdateSquadParams = {
  ownerId: string;
  id: string;
  name?: string;
  chapter?: string;
};

export type RemoveSquadParams = {
  ownerId: string;
  id: string;
};

export type AssignMarineParams = {
  ownerId: string;
  squadId: string;
  marineId: string;
};
