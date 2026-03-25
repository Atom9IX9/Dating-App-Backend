import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessAuthGuard extends AuthGuard('jwt-access') {}

export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}

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
