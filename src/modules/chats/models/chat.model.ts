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
import { User } from 'src/modules/users/models/user.model';
import { ChatUser } from './chatUser.model';
import { Message } from 'src/modules/messages/models/message.model';

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
