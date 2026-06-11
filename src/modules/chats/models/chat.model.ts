/*
 * FILE: src/modules/chats/models/chat.model.ts
 * PURPOSE: Module file with defined behavior.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  PrimaryKey,
  Table,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { User } from '@/modules/users/models/user.model';
import { ChatUser } from './chatUser.model';
import { Message } from '@/modules/messages/models/message.model';

// NestJS class implementing Chat.
@Table
export class Chat extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column(DataType.STRING)
  room: string;

  @BelongsToMany(() => User, () => ChatUser)
  chatUsers: User[];

  @HasMany(() => Message)
  messages: Message[];
}
