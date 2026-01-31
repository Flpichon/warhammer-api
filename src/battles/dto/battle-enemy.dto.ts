import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class BattleEnemyDto {
  @IsString()
  @MinLength(1)
  declare type: string;

  @IsInt()
  @Min(1)
  declare power: number;
}
