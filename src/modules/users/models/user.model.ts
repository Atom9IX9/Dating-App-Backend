import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Table,
  Model,
  PrimaryKey,
  HasMany,
  AllowNull,
  DefaultScope,
  Scopes,
  BelongsToMany,
} from 'sequelize-typescript';
import { Match } from 'src/modules/matches/models/match.model';
import { Genders } from '../types';
import { DataTypes } from 'sequelize';
import { Chat } from 'src/modules/chats/models/chat.model';
import { ChatUser } from 'src/modules/chats/models/chatUser.model';
import { Message } from 'src/modules/messages/models/message.model';

@Table
@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'createdAt', 'updatedAt'],
  },
}))
@Scopes(() => ({
  login: () => ({ attributes: { exclude: ['createdAt', 'updatedAt'] } }),
}))
export class User extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataTypes.STRING, autoIncrement: false })
  uid: string;

  @ApiProperty()
  @Column
  firstName: string;

  @ApiProperty()
  @Column
  lastName: string;

  @ApiProperty()
  @Column
  email: string;

  @ApiProperty()
  @Column
  password: string;

  @ApiProperty()
  @Column
  dateOfBD: string;

  @ApiProperty()
  @Column
  age: number;

  @ApiProperty({ enum: Genders })
  @Column
  gender: Genders;

  @ApiProperty()
  @AllowNull(true)
  @Column({ type: DataTypes.STRING(125) })
  description: string | null;

  @ApiProperty()
  @AllowNull(true)
  @Column
  location: string | null;

  @HasMany(() => Match, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  matches: Match[];

  @HasMany(() => Message)
  messages: Message[];

  @BelongsToMany(() => Chat, () => ChatUser)
  chats: Chat[];
}
