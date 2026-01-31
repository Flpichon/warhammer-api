import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MarineStatsDto } from './marine-stats.dto';

export class CreateMarineDto {
  @IsString()
  @MinLength(1)
  declare name: string;

  @IsString()
  @MinLength(1)
  declare rank: string;

  @IsOptional()
  @IsString()
  squadId?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  declare stats: MarineStatsDto;
}
