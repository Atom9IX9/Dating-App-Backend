import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/types/requests/requests';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateJwtToken(authId: number, type: 'access' | 'refresh'): string {
    const payload: JwtPayload = { authId };

    return this.jwtService.sign(payload, {
      secret:
        type === 'refresh'
          ? this.configService.get('refreshTokenSecret')
          : this.configService.get('accessTokenSecret'),
      expiresIn:
        type === 'refresh'
          ? this.configService.get('refreshTokenExpire')
          : this.configService.get('accessTokenExpire'),
    });
  }
}
