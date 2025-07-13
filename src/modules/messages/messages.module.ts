import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [SequelizeModule.forFeature([Message]), ChatsModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
