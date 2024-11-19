import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  ForeignKey,
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/models/user.model';
import { ReceivedStatuses } from '../types';

@Table
export class Match extends Model {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ApiProperty()
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  receiverId: string;

  @ApiProperty({ enum: ReceivedStatuses })
  @AllowNull(false)
  @Column
  status: ReceivedStatuses;

  @BelongsTo(() => User)
  user: User;
}
