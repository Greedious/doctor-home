import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JWTPayload } from 'package/strategies/jwt/jwt-payload';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const acceptedRoles = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );

    if (!acceptedRoles || acceptedRoles.length === 0) {
      return true;
    }

    const { user }: { user: JWTPayload } = context.switchToHttp().getRequest();

    if (!user || !acceptedRoles.some((role) => user.type.includes(role)))
      throw new HttpException(
        { message: 'Forbidden', code: 1001 },
        HttpStatus.FORBIDDEN,
      );

    return true;
  }
}
