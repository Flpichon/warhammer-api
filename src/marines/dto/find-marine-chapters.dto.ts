import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class FindMarineChaptersQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
