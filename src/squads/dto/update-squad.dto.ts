import { IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class UpdateSquadDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Trim()
  name?: string;
}
