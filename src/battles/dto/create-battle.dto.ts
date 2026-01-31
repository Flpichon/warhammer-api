import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { BattleEnemyDto } from './battle-enemy.dto';

export class CreateBattleDto {
  @IsString()
  declare squadId: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => BattleEnemyDto)
  declare enemy: BattleEnemyDto;
}
