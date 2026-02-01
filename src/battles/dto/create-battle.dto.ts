import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { BattleEnemyDto } from './battle-enemy.dto';

export class CreateBattleDto {
  @IsString()
  @Trim()
  declare squadId: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => BattleEnemyDto)
  declare enemy: BattleEnemyDto;
}
