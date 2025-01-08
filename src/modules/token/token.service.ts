import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '../users/response';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateJwtToken(user: UserResponse, rememberMe?: boolean) {
    const payload = { user };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: rememberMe
        ? this.configService.get('jwtRememberMeExpire')
        : this.configService.get('jwtExpire'),
    });
  }
}
