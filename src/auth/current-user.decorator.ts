import {
  UnauthorizedException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { JwtPayload } from './auth.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const req = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return req.user;
  },
);
