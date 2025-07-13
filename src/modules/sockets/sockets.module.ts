import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [JwtModule, ChatsModule, MessagesModule],
  providers: [Gateway],
})
export class SocketsModule {}
