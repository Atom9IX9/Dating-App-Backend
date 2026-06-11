/*
 * FILE: src/modules/auth/auth.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { AccessTokenStrategy } from '@/strategy/accessTokenStrategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auth } from './model/auth.model';
import { RefreshTokenStrategy } from '@/strategy/refreshTokenStrategy';
import { RefreshToken } from './model/refreshToken.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    TokenModule,
    SequelizeModule.forFeature([Auth, RefreshToken]),
    JwtModule,
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
// NestJS class implementing AuthModule.
export class AuthModule {}
