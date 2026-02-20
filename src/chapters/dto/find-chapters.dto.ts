import { IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class FindChaptersQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  q?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  parentId?: string;
}
