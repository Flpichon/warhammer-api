import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { MarineStatsDto } from './marine-stats.dto';

export class CreateMarineDto {
  @IsString()
  @MinLength(1)
  @Trim()
  declare name: string;

  @IsString()
  @MinLength(1)
  @Trim()
  declare rank: string;

  @IsOptional()
  @IsString()
  squadId?: string;

  @IsString()
  @MinLength(1)
  @Trim()
  declare chapter: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  declare stats: MarineStatsDto;
}
