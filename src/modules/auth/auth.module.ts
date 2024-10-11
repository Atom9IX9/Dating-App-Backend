import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from 'src/strategy';

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
