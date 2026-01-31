import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSquadDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  chapter?: string;
}
