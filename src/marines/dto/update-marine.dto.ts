import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { MarineStatsDto } from './marine-stats.dto';

export class UpdateMarineDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  rank?: string;

  @IsOptional()
  @IsString()
  @Trim()
  squadId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  chapter?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  stats?: MarineStatsDto;
}
