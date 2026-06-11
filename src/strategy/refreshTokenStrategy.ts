/*
 * FILE: src/strategy/refreshTokenStrategy.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@/common/types/requests/requests';

// NestJS class implementing RefreshTokenStrategy.
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // Inject required services and repositories for this class.
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('refreshTokenSecret'),
    });
  }

  validate(payload: JwtPayload) {
    return { authId: payload.authId, jti: payload.jti };
  }
}
