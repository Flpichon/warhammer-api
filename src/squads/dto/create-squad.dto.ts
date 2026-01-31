import { IsString, MinLength } from 'class-validator';

export class CreateSquadDto {
  @IsString()
  @MinLength(1)
  declare name: string;

  @IsString()
  @MinLength(1)
  declare chapter: string;
}
