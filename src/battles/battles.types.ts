export type CreateBattleParams = {
  ownerId: string;
  squadId: string;
  enemy: {
    type: string;
    power: number;
  };
  log: string[];
  result: string;
};

export type FindBattleByIdParams = {
  ownerId: string;
  id: string;
};

export type FindBattlesParams = {
  ownerId: string;
};

export type RemoveBattleParams = {
  ownerId: string;
  id: string;
};
