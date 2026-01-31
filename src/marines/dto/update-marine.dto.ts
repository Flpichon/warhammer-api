import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MarineStatsDto } from './marine-stats.dto';

export class UpdateMarineDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  rank?: string;

  @IsOptional()
  @IsString()
  squadId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  stats?: MarineStatsDto;
}
