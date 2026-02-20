import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { MarineStatsDto } from './marine-stats.dto';
import { Rank, Weapon } from '../marines.enums';

export class CreateMarineDto {
  @IsString()
  @MinLength(1)
  @Trim()
  declare name: string;

  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEnum(Rank)
  declare rank: Rank;

  @IsOptional()
  @IsString()
  squadId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  chapterId?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => MarineStatsDto)
  declare stats: MarineStatsDto;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(Weapon, { each: true })
  wargear?: Weapon[];
}
