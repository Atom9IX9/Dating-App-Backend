import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  PrimaryKey,
  Table,
  Model,
  DataType,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/models/user.model';
import { ChatUser } from './chatUser.model';

@Table
export class Chat extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column(DataType.STRING)
  room: string;

  @BelongsToMany(() => User, () => ChatUser)
  chatUsers: User[];
}
