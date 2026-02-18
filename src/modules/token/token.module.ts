import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './model/refreshToken.model';

@Module({
  imports: [SequelizeModule.forFeature([RefreshToken])],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
