export type CreateBattleParams = {
  enemy: {
    type: string;
    power: number;
  };
  log: string[];
  result: string;
};
