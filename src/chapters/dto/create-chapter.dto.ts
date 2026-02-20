import { IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class CreateChapterDto {
  @IsString()
  @MinLength(1)
  @Trim()
  declare name: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  parentId?: string;
}
