export type TCreateMarineParams = {
  ownerId: string;
  name: string;
  rank: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
  };
};

export type TUpdateMarineParams = Partial<TCreateMarineParams> & {
  // utile ? (MEMO @FLP)
  marineId: string;
};

export type TAssignMarineToSquadParams = {
  marineId: string;
  squadId: string;
};
