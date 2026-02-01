import { IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';

export class CreateSquadDto {
  @IsString()
  @MinLength(1)
  @Trim()
  declare name: string;

  @IsString()
  @MinLength(1)
  @Trim()
  declare chapter: string;
}
