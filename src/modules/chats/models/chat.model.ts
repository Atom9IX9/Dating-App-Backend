import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/models/user.model';
import { ChatUser } from './chatUser.model';

@Table
export class Chat extends Model {
  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column
  room: number;

  @BelongsToMany(() => User, () => ChatUser)
  chatUsers: User[];
}
