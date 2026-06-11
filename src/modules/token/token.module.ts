/*
 * FILE: src/modules/token/token.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('accessTokenSecret'),
        signOptions: {
          expiresIn: configService.get<string>('accessTokenExpire'),
        },
      }),
    }),
    
  ],
  providers: [TokenService],
  exports: [TokenService, JwtModule],
})
// NestJS class implementing TokenModule.
export class TokenModule {}


// // Refresh JWT
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('REFRESH_TOKEN_SECRET'),
//         signOptions: {
//           expiresIn: configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
//         },
//       }),
//     }),
