import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
