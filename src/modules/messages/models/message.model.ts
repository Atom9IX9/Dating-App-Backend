import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Model,
  Table,
  AllowNull,
} from 'sequelize-typescript';
import { Chat } from 'src/modules/chats/models/chat.model';
import { User } from 'src/modules/users/models/user.model';

@Table
export class Message extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @Column
  text: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  authorId: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  @ForeignKey(() => Chat)
  chatRoom: string;

  @BelongsTo(() => User, 'authorId')
  author: string;

  @BelongsTo(() => Chat, 'chatRoom')
  chat: string;
}
