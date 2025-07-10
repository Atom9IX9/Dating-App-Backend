import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [JwtModule, ChatsModule],
  providers: [Gateway],
})
export class SocketsModule {}
