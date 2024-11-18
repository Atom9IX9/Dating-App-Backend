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

  @ApiProperty()
  @AllowNull(false)
  @Column
  status: 'pending' | 'rejected' | 'accepted';

  @BelongsTo(() => User)
  user: User;
}
