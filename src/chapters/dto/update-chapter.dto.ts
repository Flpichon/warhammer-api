import { IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  parentId?: string | null;
}
