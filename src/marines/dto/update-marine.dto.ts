import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { MarineStatsDto } from './marine-stats.dto';
import { Rank, Weapon } from '../marines.enums';

export class UpdateMarineDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  name?: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEnum(Rank)
  rank?: Rank;

  @IsOptional()
  @IsString()
  @Trim()
  squadId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  chapterId?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  stats?: MarineStatsDto;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Weapon, { each: true })
  wargear?: Weapon[];
}
