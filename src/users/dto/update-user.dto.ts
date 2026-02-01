import { IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Trim()
  password?: string;
}
