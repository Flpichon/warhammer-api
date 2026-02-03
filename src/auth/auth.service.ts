import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/user.service';
import type { AuthTokenResponse, JwtPayload } from './auth.types';
import { UserResponse } from '../users/users.types';

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
  }): Promise<AuthTokenResponse> {
    const passwordHash = await bcrypt.hash(params.password, 10);
    const { auth, user } = await this.usersService.createForAuth({
      email: params.email,
      passwordHash,
    });

    const payload: JwtPayload = {
      sub: auth.id,
      email: auth.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async login(params: {
    email: string;
    password: string;
  }): Promise<AuthTokenResponse> {
    const found = await this.usersService.findForAuthByEmail({
      email: params.email,
    });
    if (!found) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordOk = await bcrypt.compare(
      params.password,
      found.auth.passwordHash,
    );
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: found.auth.id,
      email: found.auth.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: found.user };
  }

  async me(userId: string): Promise<{ user: UserResponse }> {
    const user = await this.usersService.findPublicById({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { user };
  }
}
