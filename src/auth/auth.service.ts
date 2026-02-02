import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/user.service';
import type { JwtPayload } from './auth.types';

export interface IAuthResponse extends JwtPayload {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(params: {
    email: string;
    password: string;
  }): Promise<IAuthResponse> {
    const passwordHash = await bcrypt.hash(params.password, 10);
    const created = await this.usersService.createAuth({
      email: params.email,
      passwordHash,
    });

    const payload: JwtPayload = {
      sub: created.id,
      email: created.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, ...payload };
  }

  async login(params: {
    email: string;
    password: string;
  }): Promise<IAuthResponse> {
    const user = await this.usersService.findAuthByEmail({
      email: params.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(params.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, ...payload };
  }
}
