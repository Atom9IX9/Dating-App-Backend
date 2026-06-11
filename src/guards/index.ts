/*
 * FILE: src/guards/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// NestJS class implementing AccessAuthGuard.
@Injectable()
export class AccessAuthGuard extends AuthGuard('jwt-access') {}

// NestJS class implementing RefreshAuthGuard.
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}

// NestJS class implementing ProfileGuard.
@Injectable()
export class ProfileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { uid } = request.user;

    if (!uid) {
      throw new ForbiddenException('Registration not completed');
    }

    return true;
  }
}
