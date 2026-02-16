import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { Rank } from '../marines.enums';
import { TransformFnParams } from 'class-transformer';
import { Transform } from 'class-transformer';

export class FindMarinesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEnum(Rank)
  rank?: Rank;
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  squadId?: string;
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  chapter?: string;
}
