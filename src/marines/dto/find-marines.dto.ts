import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/dto/transforms';
import { Rank } from '../marines.enums';
import { TransformFnParams } from 'class-transformer/types/interfaces/metadata/transform-fn-params.interface';
import { Transform } from 'class-transformer/types/decorators/transform.decorator';

export class FindMarinesQueryDto {
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
