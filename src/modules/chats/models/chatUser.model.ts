/*
 * FILE: src/modules/chats/models/chatUser.model.ts
 * PURPOSE: Module file with defined behavior.
 */

import { ForeignKey, Table, Model } from 'sequelize-typescript';
import { Chat } from './chat.model';
import { User } from '@/modules/users/models/user.model';

// NestJS class implementing ChatUser.
@Table
export class ChatUser extends Model {
  @ForeignKey(() => Chat)
  room: string;

  @ForeignKey(() => User)
  userId: string;
}
