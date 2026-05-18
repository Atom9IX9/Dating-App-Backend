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
  HasOne,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Match } from '@/modules/matches/models/match.model';
import { Genders } from '../types';
import { DataTypes } from 'sequelize';
import { Chat } from '@/modules/chats/models/chat.model';
import { ChatUser } from '@/modules/chats/models/chatUser.model';
import { Message } from '@/modules/messages/models/message.model';
import { UserActivity } from '@/modules/usersActivity/models/userActivity.model';
import { Auth } from '@/modules/auth/model/auth.model';
import { Hobby } from '@/modules/hobbies/models/hobby.model';
import { UserHobby } from './userHobby.model';
import { Avatar } from './avatar.model';

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
  @Column({ type: DataTypes.STRING })
  uid: string;

  @ForeignKey(() => Auth)
  @Column({ type: DataTypes.INTEGER })
  authId: number;

  @ApiProperty()
  @Column({ type: DataTypes.STRING, allowNull: false })
  firstName: string;

  @ApiProperty()
  @Column({ type: DataTypes.STRING, allowNull: false })
  lastName: string;

  @ApiProperty()
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  dateOfBD: string;

  @ApiProperty({ enum: Genders })
  @Column({ type: DataTypes.STRING, allowNull: false })
  gender: Genders;

  @ApiProperty()
  @Column({ type: DataTypes.TEXT, allowNull: true })
  genderInfo?: string;

  @ApiProperty()
  @AllowNull(true)
  @Column({ type: DataTypes.STRING(300) })
  description?: string;

  @ApiProperty()
  @AllowNull(true)
  @Column
  location: string | null;

  @HasOne(() => UserActivity)
  activity: UserActivity;

  @HasOne(() => Avatar)
  avatar: Avatar;

  @HasMany(() => Match, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  matches: Match[];

  @HasMany(() => Message)
  messages: Message[];

  @BelongsToMany(() => Chat, () => ChatUser)
  chats: Chat[];

  @BelongsTo(() => Auth)
  auth: Auth;

  @BelongsToMany(() => Hobby, () => UserHobby)
  hobbies: Hobby[];
}
