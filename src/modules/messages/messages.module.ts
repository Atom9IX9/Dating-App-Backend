/*
 * FILE: src/modules/messages/messages.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { ChatsModule } from '../chats/chats.module';
import { MessagesController } from './messages.controller';

@Module({
  imports: [SequelizeModule.forFeature([Message]), ChatsModule],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
// NestJS class implementing MessagesModule.
export class MessagesModule {}
