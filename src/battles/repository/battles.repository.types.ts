export type CreateBattleRepoParams = {
  ownerId: string;
  squadId: string;
  enemy: { type: string; power: number };
  log: string[];
  result: string;
};

export type FindBattlesByOwnerParams = {
  ownerId: string;
};

export type FindBattleByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};

export type RemoveBattleByIdAndOwnerParams = {
  id: string;
  ownerId: string;
};
