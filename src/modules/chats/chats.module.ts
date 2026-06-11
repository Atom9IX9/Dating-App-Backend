/*
 * FILE: src/modules/chats/chats.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { ChatUser } from './models/chatUser.model';
import { ChatsController } from './chats.controller';

@Module({
  imports: [SequelizeModule.forFeature([Chat, ChatUser])],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
// NestJS class implementing ChatsModule.
export class ChatsModule {}
