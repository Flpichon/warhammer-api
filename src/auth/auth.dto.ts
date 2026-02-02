import { IsEmail, IsString, MinLength } from 'class-validator';
import { Trim } from '../common/dto/transforms';

export class RegisterDto {
  @IsEmail()
  @Trim({ toLowerCase: true })
  declare email: string;

  @IsString()
  @MinLength(8)
  @Trim()
  declare password: string;
}

export class LoginDto {
  @IsEmail()
  @Trim({ toLowerCase: true })
  declare email: string;

  @IsString()
  @MinLength(1)
  @Trim()
  declare password: string;
}
