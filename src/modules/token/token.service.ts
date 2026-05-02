import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { JwtPayload } from '@/common/types/requests/requests';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateJwtToken(
    authId: number,
    type: 'access' | 'refresh',
  ): { token: string; jti?: string } {
    const payload: JwtPayload = { authId };

    if (type === 'refresh') {
      payload.jti = randomUUID();
    }

    return {
      token: this.jwtService.sign(payload, {
        secret:
          type === 'refresh'
            ? this.configService.get('refreshTokenSecret')
            : this.configService.get('accessTokenSecret'),
        expiresIn:
          type === 'refresh'
            ? `${this.configService.get('refreshTokenExpire')}s`
            : `${this.configService.get('accessTokenExpire')}s`,
      }),
      jti: payload.jti,
    };
  }
}
