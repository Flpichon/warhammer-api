import { IsInt, IsString, Min, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class BattleEnemyDto {
  @IsString()
  @MinLength(1)
  @Trim()
  declare type: string;

  @IsInt()
  @Min(1)
  declare power: number;
}
