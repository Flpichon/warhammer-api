import { IsInt, Min } from 'class-validator';

export class MarineStatsDto {
  @IsInt()
  @Min(1)
  declare hp: number;

  @IsInt()
  @Min(0)
  declare atk: number;

  @IsInt()
  @Min(0)
  declare def: number;
}
