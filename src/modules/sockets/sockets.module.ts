/*
 * FILE: src/modules/sockets/sockets.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';
import { UserActivityModule } from '../usersActivity/usersActivity.module';

@Module({
  imports: [JwtModule, ChatsModule, MessagesModule, UserActivityModule],
  providers: [Gateway],
})
// NestJS class implementing SocketsModule.
export class SocketsModule {}
