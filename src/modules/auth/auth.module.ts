import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { AccessTokenStrategy } from 'src/strategy/accessTokenStrategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auth } from './model/auth.model';

@Module({
  imports: [UserModule, TokenModule, SequelizeModule.forFeature([Auth])],
  providers: [AuthService, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
