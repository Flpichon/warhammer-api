export type UpdateMarinePatch = {
  name?: string;
  rank?: string;
  squadId?: string;
  stats?: {
    hp: number;
    atk: number;
    def: number;
  };
};
